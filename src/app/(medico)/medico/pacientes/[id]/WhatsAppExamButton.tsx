"use client";

import { MessageCircle } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { firstName } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";

interface Props {
  phone: string | null;
  patientName: string;
  examName: string;
  examDate: string;
}

export function WhatsAppExamButton({ phone, patientName, examName, examDate }: Props) {
  const message = `Olá ${firstName(patientName)}, seu resultado de ${examName} (${examDate}) já está disponível no portal da CardioVale. Acesse: ${clinic.siteUrl}/login`;
  const href = phone ? whatsappHref(phone, message) : null;

  if (!href) {
    return (
      <span
        title="Cadastre o telefone do paciente pra habilitar o envio"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-300"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title="Enviar no WhatsApp"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-deep transition-colors hover:bg-brand-light"
    >
      <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
    </a>
  );
}
