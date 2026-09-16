import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { clinic } from "@/lib/data/clinic";
import { BookingGate } from "../_booking/BookingGate";

export const metadata: Metadata = {
  title: `Agendar exame | ${clinic.name}`,
};

export default function AgendarExamePage() {
  return (
    <>
      <PageHero
        eyebrow="Agendar exame"
        title="Agende seu exame cardiológico"
        description="ECG, Ecocardiograma, Teste Ergométrico, Holter ou MAPA — resultado disponível no seu portal."
      />
      <Container className="py-16">
        <BookingGate type="EXAME" currentPath="/agendar-exame" />

        <div className="mx-auto mt-10 max-w-md rounded-card border border-ink-100 bg-surface p-6 text-center shadow-soft">
          <p className="text-sm text-ink-600">Prefere agendar por telefone?</p>
          <a
            href={clinic.examsWhatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-light px-5 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-light/70"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            Falar sobre exames no WhatsApp
          </a>
        </div>
      </Container>
    </>
  );
}
