import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/Button";
import { clinic } from "@/lib/data/clinic";
import { doctors } from "@/lib/data/doctors";

export const metadata: Metadata = {
  title: `Médicos | ${clinic.name}`,
};

export default function MedicosPage() {
  return (
    <>
      <PageHero
        eyebrow="Médicos"
        title="Equipe médica"
        description="Cardiologistas dedicados ao cuidado do seu coração."
      />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="overflow-hidden rounded-card border border-ink-100 bg-surface shadow-soft"
            >
              <div className="flex items-center gap-5 bg-brand-deep px-6 py-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
                  <Image
                    src={`/images/medicos/${doctor.photo}`}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{doctor.name}</h3>
                  <p className="text-sm text-white/70">{doctor.crm}</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Especialidades
                </p>
                <ul className="mt-3 divide-y divide-ink-100">
                  {doctor.qualifications.map((qualification) => (
                    <li
                      key={qualification.specialty}
                      className="flex items-center justify-between gap-4 py-2 text-sm"
                    >
                      <span className="font-medium text-ink-900">{qualification.specialty}</span>
                      <span className="shrink-0 text-xs text-ink-600">{qualification.rqe}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand">
                  Formação
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{doctor.bio}</p>

                <a
                  href={`https://wa.me/${doctor.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 block"
                >
                  <Button variant="secondary" className="w-full">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                    Falar com a secretária
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
