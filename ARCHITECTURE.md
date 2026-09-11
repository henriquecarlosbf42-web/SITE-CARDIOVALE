# Arquitetura — CardioVale

Ver `../spec-mestre.md` (pasta do projeto) para o briefing completo. Esse
arquivo documenta só as decisões técnicas e a estrutura de pastas.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 +
Supabase (`@supabase/supabase-js` + `@supabase/ssr`) + Lucide React +
Framer Motion.

## Estrutura de pastas

```
src/
  app/            rotas (App Router) — só composição de página, sem lógica de negócio
  components/
    ui/           primitivos reutilizáveis (Button, Card, ...) — sem acesso a dados
  lib/
    supabase/     client.ts (browser) e server.ts (Server Components/actions)
    permissions/  papéis e tabela capability → papéis (roles.ts)
  types/
    database.ts   tipos gerados do schema Supabase (placeholder até Etapa 3)
```

Conforme os ambientes forem sendo construídos, a separação continua:

- `app/(public)/` — site institucional
- `app/(paciente)/` — portal do paciente, atrás de auth
- `app/(medico)/` — portal do médico, atrás de auth
- `app/(admin)/` — painel administrativo, atrás de auth
- `app/api/` ou Server Actions — lógica que precisa do service role / regras de negócio sensíveis

Cada grupo de rota autenticado terá seu próprio `layout.tsx` checando
sessão + papel antes de renderizar (Etapa 4).

## Design system

Tokens em `src/app/globals.css` (Tailwind v4, CSS-first, sem
`tailwind.config`):

- `brand-deep` (vermelho/bordô escuro), `brand` (vermelho da marca real —
  logo enviado pelo cliente), `brand-light` (tom suave pra fundos/hover).
  Trocado de azul pra vermelho quando o cliente mandou o logo real
  (a spec original pedia azul, mas a marca já estabelecida é vermelha).
- `ink-900/600/300/100` — texto e bordas neutras
- `surface` / `surface-soft` — fundos
- `radius-card`, `shadow-soft` — cantos arredondados e sombra discreta,
  sem exagero (clareza > elegância > animação)
- Tipografia: Inter (`next/font/google`, self-hosted)

Sem dark mode automático — site institucional de clínica tem identidade
única e fixa.

Componentes em `components/ui/` (`Button`, `Card`) consomem só esses
tokens — qualquer ajuste de marca muda num lugar só.

## Papéis (Etapa 4 preenche a lógica)

`SUPER_ADMIN`, `ADMIN`, `RECEPCAO`, `MEDICO`, `PACIENTE` — definidos em
`src/lib/permissions/roles.ts`. A tabela `PERMISSIONS`
(capability → papéis) começa vazia; cada etapa que adicionar uma
funcionalidade nova declara ali quem pode acessar, e a checagem é
sempre no server (Server Action / rota), nunca só escondendo no menu.

## Supabase

`lib/supabase/client.ts` e `server.ts` seguem o padrão oficial
`@supabase/ssr` pro App Router. Variáveis de ambiente documentadas em
`.env.local.example`.

Schema (Etapa 3) em `supabase/migrations/20260910000000_initial_schema.sql`
— **aplicado no projeto Supabase real** (`tidzgigokykefbpzzvvh`, região
São Paulo) em 2026-09-10, via conexão direta ao Postgres (sem Docker
disponível neste ambiente, então o `supabase` CLI local/link não foi
usado — a migration e o seed rodaram direto contra o banco). Cobre:

- `users` — estende `auth.users` com papel (`user_role`: SUPER_ADMIN,
  ADMIN, RECEPCAO, MEDICO, PACIENTE) e dados de perfil
- Catálogos: `specialties`, `insurance_plans`, `exams`, `appointment_status`
- Pessoas: `doctors`, `staff`, `patients` (paciente pode existir sem
  login ainda — `user_id` nulo até ativar o portal)
- Agenda: `appointments` (com trava de colisão exata de horário —
  janelas de duração ficam pra lógica da Etapa 8)
- Exames: `exam_results` (registro/status rascunho-publicado) +
  `medical_documents` (arquivos, um resultado pode ter vários)
- `prescriptions`, `notifications`, `audit_logs`, `site_content`

RLS ativado em todas as tabelas, mas sem policies ainda — ou seja,
hoje nada é acessível via `anon`/`authenticated`, só via service role.
Policies reais entram na Etapa 4 (acesso por papel) e Etapa 11
(auditoria fina). `supabase/seed.sql` já rodou contra o banco real e
populou `appointment_status`, `specialties`, `exams` e `insurance_plans`
com os mesmos dados de `src/lib/data/*.ts` (specialties e insurance_plans
foram sincronizados com os dados reais coletados depois da Etapa 3
original — ver histórico do `seed.sql`).

`types/database.ts` gerado a partir do schema real (introspecção via
`pg` direto no Postgres — o gerador oficial do CLI precisa de Docker,
indisponível neste ambiente, então os tipos foram gerados por um
script equivalente, não pelo comando oficial `supabase gen types`).
Reflete as 15 tabelas e os 4 enums reais.

## Pendências

- Nenhuma rota autenticada ainda (Etapa 4) — é o próximo passo
- Nenhuma RLS policy criada ainda (tabelas seguras por padrão, mas
  ninguém autenticado consegue ler/escrever nada ainda)
- `doctors`/`patients` sem linhas ainda — dependem de `auth.users`
  reais, que só existirão depois do fluxo de login (Etapa 4/5/6)
- Tipos gerados por script próprio, não pelo `supabase gen types`
  oficial — reexecutar `gen-types.js` (não versionado, script pontual)
  se o schema mudar antes de termos Docker ou o projeto linkado
