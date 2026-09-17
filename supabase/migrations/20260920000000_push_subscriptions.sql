-- Notificações push pro app instalado (PWA) — cada dispositivo em que o
-- paciente ativa notificação salva uma "subscription" aqui. O envio em
-- si roda no servidor com a service-role key (bypassa RLS), lendo todas
-- as subscriptions de um paciente pra avisar quando um exame é publicado.

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy "users manage own push subscriptions"
  on push_subscriptions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
