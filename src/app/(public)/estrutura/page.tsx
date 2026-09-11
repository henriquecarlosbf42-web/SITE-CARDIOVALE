import type { Metadata } from "next";
import Image from "next/image";
import { Building2, Car, DoorOpen, Sofa } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { clinic } from "@/lib/data/clinic";

export const metadata: Metadata = {
  title: `Estrutura | ${clinic.name}`,
};

const features = [
  { icon: Building2, title: "Tudo em um só lugar", description: "Consultas e exames no mesmo endereço." },
  { icon: Sofa, title: "Recepção confortável", description: "Espaço pensado pra você esperar com tranquilidade." },
  { icon: DoorOpen, title: "Acesso facilitado", description: "Fácil localização, no centro de São José dos Campos." },
  { icon: Car, title: "Estacionamento na região", description: "Opções de estacionamento próximas à clínica." },
];

const gallery = [
  { file: "recepcao.jpg", alt: "Recepção da CardioVale" },
  { file: "consultorio.jpg", alt: "Consultório médico da CardioVale" },
  { file: "corredor.jpg", alt: "Corredor e sala de espera da CardioVale" },
];

export default function EstruturaPage() {
  return (
    <>
      <PageHero
        eyebrow="Estrutura"
        title="Uma clínica pensada pra você"
        description={`Em ${clinic.address.city}, com estrutura própria pra consultas e exames.`}
      />
      <Container className="py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title}>
              <f.icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
              <h3 className="mt-4 font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{f.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((photo) => (
            <div
              key={photo.file}
              className="relative aspect-[4/3] overflow-hidden rounded-card border border-ink-100 shadow-soft"
            >
              <Image
                src={`/images/estrutura/${photo.file}`}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
