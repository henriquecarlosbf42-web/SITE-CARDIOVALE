-- Login do paciente passa a ser por CPF em vez de e-mail (pedido do
-- médico — paciente esquece o e-mail que usou, mas não esquece o CPF).
--
-- O Supabase Auth só autentica por e-mail/senha, então o CPF precisa
-- ser resolvido pro e-mail correspondente antes de chamar
-- signInWithPassword. Isso não pode ser um SELECT direto na tabela
-- `patients` (RLS bloqueia leitura anônima, e não queremos abrir a
-- tabela toda) — uma função SECURITY DEFINER expõe só o mínimo: o
-- e-mail de um paciente já com login vinculado, dado o CPF exato.

create function resolve_patient_login_email(p_cpf text)
returns text
language sql stable security definer set search_path = public as $$
  select email from patients where cpf = p_cpf and user_id is not null limit 1;
$$;

revoke all on function resolve_patient_login_email(text) from public;
grant execute on function resolve_patient_login_email(text) to anon, authenticated;
