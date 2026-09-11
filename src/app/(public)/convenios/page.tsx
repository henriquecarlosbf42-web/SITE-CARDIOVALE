import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { InsuranceSearch } from "@/components/site/InsuranceSearch";
import { clinic } from "@/lib/data/clinic";
import { insurancePlans } from "@/lib/data/insurance-plans";

export const metadata: Metadata = {
  title: `Convênios | ${clinic.name}`,
};

export default function ConveniosPage() {
  return (
    <>
      <PageHero
        eyebrow="Convênios"
        title="Convênios e particular"
        description="Consulte a disponibilidade do seu convênio ou atenda-se como paciente particular."
      />
      <Container className="py-16">
        <InsuranceSearch />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {insurancePlans.map((plan) => (
            <div
              key={plan.file}
              className="flex h-24 items-center justify-center rounded-card border border-ink-100 bg-white p-4 shadow-soft"
            >
              <Image
                src={`/images/convenios/${plan.file}`}
                alt={plan.name}
                width={1550}
                height={1020}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-600">
          Não achou o seu convênio na lista? Fale com a recepção pelo WhatsApp
          ({clinic.whatsapp}) pra confirmar.
        </p>
      </Container>
    </>
  );
}
