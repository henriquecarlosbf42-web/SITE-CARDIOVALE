-- Dados de referência — carregados em todo ambiente local/dev
-- (`supabase db reset`). Mantidos em sincronia com src/lib/data/*.ts.

insert into appointment_status (code, label, color, sort_order) values
  ('AGENDADA', 'Agendada', '#d21e32', 1),
  ('CONFIRMADA', 'Confirmada', '#2563eb', 2),
  ('EM_ESPERA', 'Em espera', '#a855f7', 3),
  ('EM_ATENDIMENTO', 'Em atendimento', '#f59e0b', 4),
  ('ATENDIDA', 'Atendida', '#16a34a', 5),
  ('CANCELADA', 'Cancelada', '#6b7280', 6),
  ('FALTOU', 'Faltou', '#dc2626', 7),
  ('REAGENDADA', 'Reagendada', '#0891b2', 8);

insert into specialties (name, description) values
  ('Cardiologia Clínica', 'Avaliação, diagnóstico e acompanhamento contínuo do coração e do sistema cardiovascular.'),
  ('Cardiologia do Esporte', 'Avaliação cardiológica voltada pra quem pratica atividade física ou esporte.'),
  ('Ecocardiografia', 'Exames de imagem do coração, incluindo Ecocardiograma Transtorácico com Doppler em Cores.'),
  ('Medicina de Emergência', 'Atendimento especializado para situações cardiológicas agudas.');

insert into exams (slug, name, summary, description) values
  ('eletrocardiograma', 'Eletrocardiograma (ECG)', 'Registra a atividade elétrica do coração em repouso.',
   'Exame rápido e indolor que capta os impulsos elétricos do coração através de eletrodos colados na pele. É o primeiro passo pra investigar arritmias, sobrecarga do coração e sinais de infarto antigo.'),
  ('ecocardiograma', 'Ecocardiograma', 'Ultrassom que mostra a estrutura e o funcionamento do coração.',
   'Usa ultrassom pra visualizar em tempo real o tamanho das câmaras cardíacas, o funcionamento das válvulas e a força de bombeamento do coração.'),
  ('teste-ergometrico', 'Teste Ergométrico', 'Avalia o coração em esforço, caminhando na esteira.',
   'Monitora a pressão arterial, o ritmo cardíaco e o ECG enquanto o paciente caminha na esteira, com esforço aumentado aos poucos. Ajuda a identificar problemas que só aparecem sob esforço físico.'),
  ('holter', 'Holter 24h', 'Monitora o ritmo cardíaco continuamente por 24 horas.',
   'Um aparelho portátil registra o ritmo do coração durante um dia inteiro de rotina normal, útil pra flagrar arritmias que não aparecem num ECG comum.'),
  ('mapa', 'MAPA', 'Monitorização ambulatorial da pressão arterial por 24 horas.',
   'Mede a pressão arterial em intervalos regulares ao longo de 24 horas, inclusive durante o sono, pra um diagnóstico mais preciso de hipertensão.');

insert into insurance_plans (name) values
  ('Hapvida'), ('Santa Casa'), ('Golden Cross'), ('Unimed'), ('Gama Saúde'),
  ('Fundação Joseph'), ('Policlin'), ('Sepaco'), ('Medial Saúde'), ('Allianz'),
  ('Solumédi'), ('Porto Seguro'), ('NotreDame Saúde'), ('CAASP'), ('IAFRESP'),
  ('Vale'), ('Omint'), ('Postal Saúde'), ('Ambep'), ('Amil'), ('Aussel'),
  ('Cassi'), ('Vivest'), ('APS Petrobras'), ('SulAmérica'), ('Bradesco Saúde Embraer');
