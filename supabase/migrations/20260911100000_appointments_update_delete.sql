-- Médico edita, cancela (muda status) ou exclui consultas que ele mesmo
-- agendou pros próprios pacientes.

create policy "doctors update own appointments"
  on appointments for update
  to authenticated
  using (doctor_id = current_doctor_id())
  with check (doctor_id = current_doctor_id());

create policy "doctors delete own appointments"
  on appointments for delete
  to authenticated
  using (doctor_id = current_doctor_id());
