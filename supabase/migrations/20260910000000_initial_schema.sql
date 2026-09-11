-- CardioVale — schema inicial (Etapa 3)
-- Cobre: perfis/papéis, cadastros (pacientes, médicos, staff), agenda,
-- resultados de exames, documentos, prescrições, notificações, auditoria
-- e conteúdo do site. RLS é ativado em todas as tabelas mas as políticas
-- de acesso entram nas Etapas 4 (autenticação/perfis) e 11 (segurança/
-- auditoria) — até lá, sem policy, ninguém acessa via anon/authenticated.

create extension if not exists pgcrypto;

-- ── Enums ────────────────────────────────────────────────────────────

create type user_role as enum ('SUPER_ADMIN', 'ADMIN', 'RECEPCAO', 'MEDICO', 'PACIENTE');
create type appointment_type as enum ('CONSULTA', 'RETORNO', 'EXAME');
create type exam_result_status as enum ('RASCUNHO', 'PUBLICADO');
create type notification_type as enum (
  'CONFIRMACAO_CONSULTA',
  'LEMBRETE_CONSULTA',
  'ALTERACAO_HORARIO',
  'RESULTADO_DISPONIVEL',
  'GERAL'
);

-- ── Função utilitária: updated_at automático ────────────────────────

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── users — estende auth.users com papel/perfil da aplicação ───────

create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'PACIENTE',
  full_name text not null,
  phone text,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_users_updated_at
  before update on users
  for each row execute function set_updated_at();

-- ── Catálogos ────────────────────────────────────────────────────────

create table specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table insurance_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table appointment_status (
  code text primary key,
  label text not null,
  color text,
  sort_order smallint not null default 0
);

-- ── Pessoas ──────────────────────────────────────────────────────────

create table doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users (id) on delete cascade,
  crm text not null unique,
  specialty_id uuid references specialties (id) on delete set null,
  bio text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_doctors_updated_at
  before update on doctors
  for each row execute function set_updated_at();

create table staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users (id) on delete cascade,
  job_title text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table patients (
  id uuid primary key default gen_random_uuid(),
  -- nulo até o paciente ativar o login do portal — cadastro pode ser
  -- feito pela recepção antes disso
  user_id uuid unique references users (id) on delete set null,
  full_name text not null,
  cpf text unique,
  birth_date date,
  phone text,
  email text,
  insurance_plan_id uuid references insurance_plans (id) on delete set null,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_patients_updated_at
  before update on patients
  for each row execute function set_updated_at();

-- ── Agenda ───────────────────────────────────────────────────────────

create table appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  doctor_id uuid not null references doctors (id) on delete restrict,
  specialty_id uuid references specialties (id) on delete set null,
  exam_id uuid references exams (id) on delete set null,
  type appointment_type not null default 'CONSULTA',
  status_code text not null default 'AGENDADA' references appointment_status (code),
  scheduled_at timestamptz not null,
  duration_minutes smallint not null default 30,
  insurance_plan_id uuid references insurance_plans (id) on delete set null,
  notes text,
  created_by uuid references users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- trava a colisão exata de horário; janelas de duração ficam pra
  -- lógica de aplicação na Etapa 8
  unique (doctor_id, scheduled_at)
);

create trigger set_appointments_updated_at
  before update on appointments
  for each row execute function set_updated_at();

create index appointments_patient_id_idx on appointments (patient_id);
create index appointments_doctor_id_idx on appointments (doctor_id);
create index appointments_scheduled_at_idx on appointments (scheduled_at);

-- ── Resultados de exames e documentos ──────────────────────────────

create table exam_results (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  exam_id uuid not null references exams (id) on delete restrict,
  doctor_id uuid references doctors (id) on delete set null,
  appointment_id uuid references appointments (id) on delete set null,
  exam_date date not null,
  status exam_result_status not null default 'RASCUNHO',
  notes text,
  released_at timestamptz,
  created_by uuid references users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_exam_results_updated_at
  before update on exam_results
  for each row execute function set_updated_at();

create index exam_results_patient_id_idx on exam_results (patient_id);

create table medical_documents (
  id uuid primary key default gen_random_uuid(),
  exam_result_id uuid not null references exam_results (id) on delete cascade,
  -- caminho no bucket privado do Supabase Storage (não a URL pública)
  file_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index medical_documents_exam_result_id_idx on medical_documents (exam_result_id);

-- ── Prescrições ──────────────────────────────────────────────────────

create table prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id) on delete cascade,
  doctor_id uuid not null references doctors (id) on delete restrict,
  appointment_id uuid references appointments (id) on delete set null,
  description text not null,
  file_path text,
  issued_at timestamptz not null default now(),
  created_by uuid references users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index prescriptions_patient_id_idx on prescriptions (patient_id);

-- ── Notificações ─────────────────────────────────────────────────────

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  related_appointment_id uuid references appointments (id) on delete set null,
  related_exam_result_id uuid references exam_results (id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on notifications (user_id, read_at);

-- ── Auditoria ────────────────────────────────────────────────────────

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);

-- ── Conteúdo do site (painel administrativo) ───────────────────────

create table site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  body text,
  published boolean not null default true,
  updated_by uuid references users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger set_site_content_updated_at
  before update on site_content
  for each row execute function set_updated_at();

-- ── RLS — ativado em tudo; políticas chegam nas Etapas 4 e 11 ──────

alter table users enable row level security;
alter table specialties enable row level security;
alter table insurance_plans enable row level security;
alter table exams enable row level security;
alter table appointment_status enable row level security;
alter table doctors enable row level security;
alter table staff enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table exam_results enable row level security;
alter table medical_documents enable row level security;
alter table prescriptions enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;
alter table site_content enable row level security;
