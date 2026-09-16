-- A página inicial (site público, sem login) precisa listar os exames
-- ativos — até aqui só "authenticated" podia ler a tabela `exams`.

create policy "anon read active exams"
  on exams for select
  to anon
  using (active = true);
