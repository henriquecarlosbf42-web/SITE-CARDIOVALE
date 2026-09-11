import type { Metadata } from "next";
import Link from "next/link";
import { Bell, FileHeart, History } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { clinic } from "@/lib/data/clinic";

export const metadata: Metadata = {
  title: `Área do paciente | ${clinic.name}`,
};

const benefits = [
  { icon: FileHeart, title: "Resultados de exames", description: "Acesse seus resultados assim que forem liberados pelo médico." },
  { icon: History, title: "Histórico completo", description: "Consultas, exames e prescrições, tudo num só lugar." },
  { icon: Bell, title: "Notificações", description: "Avisos de resultado disponível e lembretes de consulta." },
];

export default function AreaDoPacientePage() {
  return (
    <>
      <PageHero
        eyebrow="Área do paciente"
        title="Seu portal CardioVale"
        description="Login seguro pra acompanhar sua jornada de cuidado com o coração."
      />
      <Container className="py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title}>
              <b.icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
              <h3 className="mt-4 font-semibold text-ink-900">{b.title}</h3>
              <p className="mt-2 text-sm text-ink-600">{b.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/login">
            <Button variant="primary">Entrar no portal</Button>
          </Link>
        </div>
        <p className="mt-4 text-center text-sm text-ink-600">
          Ainda não tem acesso? Fale com a recepção pelo WhatsApp ({clinic.whatsapp}).
        </p>
      </Container>
    </>
  );
}
