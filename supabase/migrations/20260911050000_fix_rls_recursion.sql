-- Corrige recursão infinita: a policy de `appointments` consultava
-- `patients`, e a de `patients` consultava `appointments` de volta.
-- Solução: funções SECURITY DEFINER que leem essas tabelas sem
-- reacionar as policies (o dono da função — postgres — não está sujeito
-- a RLS nas próprias tabelas), quebrando o ciclo.

create function current_patient_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from patients where user_id = auth.uid() limit 1;
$$;

create function current_doctor_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from doctors where user_id = auth.uid() limit 1;
$$;

create function current_doctor_patient_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select distinct patient_id from appointments where doctor_id = current_doctor_id();
$$;

-- ── appointments ─────────────────────────────────────────────────────

drop policy "patients read own appointments" on appointments;
drop policy "doctors read own appointments" on appointments;

create policy "patients read own appointments"
  on appointments for select
  using (patient_id = current_patient_id());

create policy "doctors read own appointments"
  on appointments for select
  using (doctor_id = current_doctor_id());

-- ── patients ─────────────────────────────────────────────────────────

drop policy "doctors read their patients" on patients;

create policy "doctors read their patients"
  on patients for select
  using (id in (select current_doctor_patient_ids()));

-- ── exam_results ─────────────────────────────────────────────────────

drop policy "patients read own published exam results" on exam_results;
drop policy "doctors read exam results of their patients" on exam_results;

create policy "patients read own published exam results"
  on exam_results for select
  using (status = 'PUBLICADO' and patient_id = current_patient_id());

create policy "doctors read exam results of their patients"
  on exam_results for select
  using (patient_id in (select current_doctor_patient_ids()));

-- ── medical_documents ────────────────────────────────────────────────

drop policy "patients read own documents from published results" on medical_documents;
drop policy "doctors read documents of their patients results" on medical_documents;

create policy "patients read own documents from published results"
  on medical_documents for select
  using (
    exam_result_id in (
      select id from exam_results
      where status = 'PUBLICADO' and patient_id = current_patient_id()
    )
  );

create policy "doctors read documents of their patients results"
  on medical_documents for select
  using (
    exam_result_id in (
      select id from exam_results where patient_id in (select current_doctor_patient_ids())
    )
  );

-- ── prescriptions ────────────────────────────────────────────────────

drop policy "patients read own prescriptions" on prescriptions;
drop policy "doctors read prescriptions of their patients" on prescriptions;

create policy "patients read own prescriptions"
  on prescriptions for select
  using (patient_id = current_patient_id());

create policy "doctors read prescriptions of their patients"
  on prescriptions for select
  using (patient_id in (select current_doctor_patient_ids()));
