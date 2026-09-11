-- Etapa 4 — Autenticação e Perfis
-- RLS mínima pra login funcionar (cada usuário lê/edita só o próprio
-- perfil) + trigger que cria a linha em `public.users` assim que uma
-- conta é criada em `auth.users` (papel padrão PACIENTE — promoções
-- pra MEDICO/ADMIN/etc. são feitas depois, à mão ou pelo painel
-- administrativo da Etapa 9).

create policy "users read own profile"
  on users for select
  using (auth.uid() = id);

create policy "users update own profile"
  on users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create function handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, role, full_name)
  values (
    new.id,
    'PACIENTE',
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Sem nome')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
