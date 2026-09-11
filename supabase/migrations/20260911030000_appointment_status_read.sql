create policy "authenticated read appointment_status"
  on appointment_status for select
  to authenticated
  using (true);
