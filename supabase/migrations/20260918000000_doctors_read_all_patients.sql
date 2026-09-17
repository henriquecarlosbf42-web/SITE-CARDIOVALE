-- Paciente cadastrado pelo painel admin ou que se cadastrou sozinho
-- fica vinculado só à clínica, sem médico nenhum ainda — até aqui
-- nenhum médico conseguia nem VER esse paciente (a leitura era
-- restrita a quem já tinha consulta registrada). Agora qualquer
-- médico consegue buscar entre todos os pacientes da clínica, e
-- decide explicitamente quando "vincular" (criar o primeiro
-- atendimento) — sem isso ele segue sem aparecer na lista pessoal do
-- médico nem liberado pra lançar exame.

create function is_doctor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from doctors where user_id = auth.uid() and active);
$$;

create policy "doctors read all clinic patients"
  on patients for select
  to authenticated
  using (is_doctor());

-- paciente já vinculado (tem consulta) com UM médico fica indisponível
-- pra outro reivindicar — essa função devolve só o conjunto de ids já
-- "tomados", sem expor de qual médico é cada um.
create function claimed_patient_ids() returns setof uuid
language sql stable security definer set search_path = public as $$
  select distinct patient_id from appointments;
$$;
