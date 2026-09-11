import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { clinic } from "@/lib/data/clinic";
import { BookingGate } from "../_booking/BookingGate";

export const metadata: Metadata = {
  title: `Agendar consulta | ${clinic.name}`,
};

export default function AgendarConsultaPage() {
  return (
    <>
      <PageHero
        eyebrow="Agendar consulta"
        title="Agende sua consulta com um cardiologista"
        description="Escolha especialidade, médico, data e horário — confirmação na hora."
      />
      <Container className="py-16">
        <BookingGate type="CONSULTA" currentPath="/agendar-consulta" />
      </Container>
    </>
  );
}
