import type { Metadata } from "next";
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
      </Container>
    </>
  );
}
