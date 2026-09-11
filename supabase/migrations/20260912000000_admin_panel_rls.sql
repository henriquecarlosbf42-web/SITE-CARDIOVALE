-- Etapa 9 — Painel Administrativo
-- SUPER_ADMIN / ADMIN / RECEPCAO ganham acesso amplo de gestão aos
-- cadastros e à agenda. Um único helper SECURITY DEFINER evita repetir
-- a checagem de papel (e evita recursão, já que ele mesmo lê `users`
-- por fora do RLS).

create function is_admin_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from users
    where id = auth.uid() and role in ('SUPER_ADMIN', 'ADMIN', 'RECEPCAO') and active
  );
$$;

create policy "admin staff manage patients"
  on patients for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff manage doctors"
  on doctors for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff manage specialties"
  on specialties for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff manage exams"
  on exams for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff manage insurance plans"
  on insurance_plans for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff manage appointments"
  on appointments for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff manage staff"
  on staff for all to authenticated
  using (is_admin_staff()) with check (is_admin_staff());

create policy "admin staff read all users"
  on users for select to authenticated
  using (is_admin_staff());

create policy "admin staff update all users"
  on users for update to authenticated
  using (is_admin_staff()) with check (is_admin_staff());
