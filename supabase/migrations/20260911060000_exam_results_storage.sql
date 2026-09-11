-- Etapa 7 — Resultados de Exames
-- Bucket privado de Storage + regras pra médico criar/anexar/publicar
-- resultado e paciente baixar só o que já foi liberado, via URL
-- assinada (nunca um link público direto).
--
-- Convenção de caminho no bucket: <patient_id>/<exam_result_id>/<arquivo>
-- — dá pra checar permissão só olhando os dois primeiros segmentos do
-- caminho, sem precisar de outra tabela de metadados.

insert into storage.buckets (id, name, public)
values ('medical-documents', 'medical-documents', false)
on conflict (id) do nothing;

-- ── exam_results — médico cria/edita os próprios ───────────────────

create policy "doctors insert exam results for their patients"
  on exam_results for insert
  to authenticated
  with check (
    doctor_id = current_doctor_id()
    and patient_id in (select current_doctor_patient_ids())
  );

create policy "doctors update own exam results"
  on exam_results for update
  to authenticated
  using (doctor_id = current_doctor_id())
  with check (doctor_id = current_doctor_id());

-- ── medical_documents — médico anexa nos próprios resultados ───────

create policy "doctors insert documents for their exam results"
  on medical_documents for insert
  to authenticated
  with check (
    exam_result_id in (select id from exam_results where doctor_id = current_doctor_id())
  );

-- ── storage.objects — upload e download controlados ────────────────

create policy "doctors upload documents for their patients"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'medical-documents'
    and (storage.foldername(name))[1]::uuid in (select current_doctor_patient_ids())
  );

create policy "doctors read documents of their patients"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'medical-documents'
    and (storage.foldername(name))[1]::uuid in (select current_doctor_patient_ids())
  );

create policy "patients read own published documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'medical-documents'
    and (storage.foldername(name))[1]::uuid = current_patient_id()
    and (storage.foldername(name))[2]::uuid in (
      select id from exam_results
      where status = 'PUBLICADO' and patient_id = current_patient_id()
    )
  );
