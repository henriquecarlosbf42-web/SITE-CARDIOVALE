-- Paciente cadastrado pelo médico recebe uma senha padrão previsível
-- (nascimento + 2 dígitos do CPF) — o Chrome/Google Password Manager
-- corretamente acusa esse tipo de senha como fraca/vazada. Em vez de
-- só trocar o padrão por outro também fixo, força a pessoa a criar
-- uma senha própria no primeiro acesso.

alter table users add column must_change_password boolean not null default false;
