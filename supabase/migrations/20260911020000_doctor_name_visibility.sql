-- Etapa 5 — permite que qualquer usuário autenticado veja o nome (e
-- outros campos de `users`) de quem é médico ativo — necessário pra
-- mostrar "Dr(a). Fulano" numa consulta/exame do paciente. Continua sem
-- liberar a linha de outros pacientes/staff.

create policy "authenticated read doctor profiles"
  on users for select
  to authenticated
  using (
    id in (select user_id from doctors where active = true)
  );
