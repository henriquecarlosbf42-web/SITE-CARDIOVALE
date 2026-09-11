-- A policy "patients claim unlinked record" só permite o UPDATE em si
-- (linha ainda sem user_id, vinculando pra quem está logado); mas pra
-- ACHAR essa linha por CPF antes de reivindicar, um SELECT direto
-- esbarraria na policy de leitura (só enxerga o próprio registro, que
-- ainda não existe). Função SECURITY DEFINER resolve: ela mesma checa
-- CPF + data de nascimento e só then vincula, sem expor a tabela via
-- SELECT solto pro paciente ainda não vinculado.

create function claim_patient_record(p_cpf text, p_birth_date date)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_patient_id uuid;
begin
  select id into v_patient_id
  from patients
  where cpf = p_cpf and birth_date = p_birth_date and user_id is null
  limit 1;

  if v_patient_id is null then
    return false;
  end if;

  update patients set user_id = auth.uid() where id = v_patient_id;
  return true;
end;
$$;

revoke all on function claim_patient_record(text, date) from public;
grant execute on function claim_patient_record(text, date) to authenticated;
