-- Etapa 6 — Portal Médico
-- Médico só vê a própria agenda e só os pacientes com quem tem consulta
-- (passada ou futura) — nunca a base inteira de pacientes da clínica.
-- Vê rascunho e publicado dos próprios pacientes (uso clínico interno;
-- quem nunca vê rascunho é o paciente, já garantido na Etapa 5).

create policy "doctors read own record"
  on doctors for select
  using (user_id = auth.uid());

create policy "doctors read own appointments"
  on appointments for select
  using (
    doctor_id in (select id from doctors where user_id = auth.uid())
  );

create policy "doctors read their patients"
  on patients for select
  using (
    id in (
      select patient_id from appointments
      where doctor_id in (select id from doctors where user_id = auth.uid())
    )
  );

create policy "doctors read exam results of their patients"
  on exam_results for select
  using (
    patient_id in (
      select patient_id from appointments
      where doctor_id in (select id from doctors where user_id = auth.uid())
    )
  );

create policy "doctors read documents of their patients results"
  on medical_documents for select
  using (
    exam_result_id in (
      select id from exam_results where patient_id in (
        select patient_id from appointments
        where doctor_id in (select id from doctors where user_id = auth.uid())
      )
    )
  );

create policy "doctors read prescriptions of their patients"
  on prescriptions for select
  using (
    patient_id in (
      select patient_id from appointments
      where doctor_id in (select id from doctors where user_id = auth.uid())
    )
  );
