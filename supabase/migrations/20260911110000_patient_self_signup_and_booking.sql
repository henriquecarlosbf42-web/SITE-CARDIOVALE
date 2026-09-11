-- Etapa 8 — Agendamento
-- Cadastro público de paciente (auto-atendimento) + agendamento online.
--
-- Antes disso só a recepção/admin criava linhas em `patients` (via
-- service role, fora de RLS). Agora o próprio paciente pode:
--   1) criar seu registro de paciente ligado à própria conta, ou
--   2) "reivindicar" um registro já existente (cadastrado antes pela
--      recepção, ainda sem login) que bata com o CPF informado — a
--      policy só permite herdar linhas ainda não vinculadas
--      (user_id is null) e só pra si mesmo (user_id = auth.uid()); a
--      checagem de CPF + data de nascimento acontece na Server Action,
--      antes do update chegar aqui.

create policy "patients insert own record"
  on patients for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "patients claim unlinked record"
  on patients for update
  to authenticated
  using (user_id is null)
  with check (user_id = auth.uid());

-- Paciente cria a própria consulta/exame pelo agendamento online.
create policy "patients insert own appointments"
  on appointments for insert
  to authenticated
  with check (patient_id = current_patient_id());
