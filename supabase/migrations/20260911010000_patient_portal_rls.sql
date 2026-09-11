-- Etapa 5 — Portal do Paciente
-- RLS pra cada paciente ver só os próprios dados. Resultado de exame em
-- rascunho NUNCA aparece pro paciente — só quando status = 'PUBLICADO'
-- (é o próprio médico/staff que libera, na Etapa 7).

-- ── patients ─────────────────────────────────────────────────────────

create policy "patients read own row"
  on patients for select
  using (user_id = auth.uid());

-- ── appointments ─────────────────────────────────────────────────────

create policy "patients read own appointments"
  on appointments for select
  using (
    patient_id in (select id from patients where user_id = auth.uid())
  );

-- ── exam_results ─────────────────────────────────────────────────────

create policy "patients read own published exam results"
  on exam_results for select
  using (
    status = 'PUBLICADO'
    and patient_id in (select id from patients where user_id = auth.uid())
  );

-- ── medical_documents ────────────────────────────────────────────────

create policy "patients read own documents from published results"
  on medical_documents for select
  using (
    exam_result_id in (
      select id from exam_results
      where status = 'PUBLICADO'
        and patient_id in (select id from patients where user_id = auth.uid())
    )
  );

-- ── prescriptions ────────────────────────────────────────────────────

create policy "patients read own prescriptions"
  on prescriptions for select
  using (
    patient_id in (select id from patients where user_id = auth.uid())
  );

-- ── notifications ────────────────────────────────────────────────────

create policy "users read own notifications"
  on notifications for select
  using (user_id = auth.uid());

create policy "users update own notifications"
  on notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── catálogos — leitura liberada pra qualquer usuário autenticado ───

create policy "authenticated read specialties"
  on specialties for select
  to authenticated
  using (true);

create policy "authenticated read exams"
  on exams for select
  to authenticated
  using (true);

create policy "authenticated read insurance_plans"
  on insurance_plans for select
  to authenticated
  using (true);

create policy "authenticated read active doctors"
  on doctors for select
  to authenticated
  using (active = true);
