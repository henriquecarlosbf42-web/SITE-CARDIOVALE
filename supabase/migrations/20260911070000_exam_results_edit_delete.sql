-- Etapa 7 (complemento) — médico edita e exclui os próprios resultados de
-- exame, e anexa novos arquivos a um resultado já existente.

create policy "doctors delete own exam results"
  on exam_results for delete
  to authenticated
  using (doctor_id = current_doctor_id());

create policy "doctors delete documents for their exam results"
  on medical_documents for delete
  to authenticated
  using (
    exam_result_id in (select id from exam_results where doctor_id = current_doctor_id())
  );

create policy "doctors delete documents for their patients"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'medical-documents'
    and (storage.foldername(name))[1]::uuid in (select current_doctor_patient_ids())
  );
