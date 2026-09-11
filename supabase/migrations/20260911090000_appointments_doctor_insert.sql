-- Médico agenda consulta/retorno avulso pros próprios pacientes direto do
-- portal (o fluxo completo de agendamento multi-etapa fica pra Etapa 8).

create policy "doctors insert appointments for their patients"
  on appointments for insert
  to authenticated
  with check (
    doctor_id = current_doctor_id()
    and patient_id in (select current_doctor_patient_ids())
  );
