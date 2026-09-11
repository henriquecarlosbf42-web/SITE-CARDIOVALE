import { FileHeart, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { ParallaxHero } from "@/components/site/ParallaxHero";
import { InstagramIcon } from "@/components/site/InstagramIcon";
import { clinic } from "@/lib/data/clinic";
import { InsuranceSearch } from "@/components/site/InsuranceSearch";
import { InsuranceMarquee } from "@/components/site/InsuranceMarquee";
import { ServicesToggle } from "@/components/site/ServicesToggle";
import { ReviewsSection } from "@/components/site/ReviewsSection";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Segurança dos seus dados",
    description:
      "Resultados de exames acessíveis só por você, com login próprio e armazenamento protegido.",
  },
  {
    icon: FileHeart,
    title: "Tudo em um só lugar",
    description:
      "Histórico de consultas, exames e prescrições organizados no seu portal do paciente.",
  },
  {
    icon: UserRound,
    title: "Equipe especializada",
    description: "Atendimento cardiológico completo, do exame ao acompanhamento.",
  },
];

export default function Home() {
  return (
    <>
      <ParallaxHero />

      <div className="bg-surface px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-8">
          <a
            href={clinic.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-deep hover:underline"
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} />
            {clinic.phone}
          </a>
          <a
            href={clinic.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-deep hover:underline"
          >
            <InstagramIcon className="h-4 w-4" />
            @cardiovale.sjc
          </a>
        </div>
      </div>

      <div className="bg-surface px-6 pt-10">
        <InsuranceSearch />
      </div>

      <InsuranceMarquee />

      <section className="py-20">
        <Container>
          <ServicesToggle />
        </Container>
      </section>

      <section className="bg-surface-soft py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              Portal do paciente
            </p>
            <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-3xl">
              Seus resultados, disponíveis quando você precisar
            </h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <Card key={point.title}>
                <point.icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
                <h3 className="mt-4 font-semibold text-ink-900">{point.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{point.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <ReviewsSection />
    </>
  );
}
