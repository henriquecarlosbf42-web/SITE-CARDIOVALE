-- Médico cria/edita/exclui as próprias prescrições dos pacientes que
-- atende (até aqui só existia leitura, herdada da Etapa 6).

create policy "doctors insert prescriptions for their patients"
  on prescriptions for insert
  to authenticated
  with check (
    doctor_id = current_doctor_id()
    and patient_id in (select current_doctor_patient_ids())
  );

create policy "doctors update own prescriptions"
  on prescriptions for update
  to authenticated
  using (doctor_id = current_doctor_id())
  with check (doctor_id = current_doctor_id());

create policy "doctors delete own prescriptions"
  on prescriptions for delete
  to authenticated
  using (doctor_id = current_doctor_id());
