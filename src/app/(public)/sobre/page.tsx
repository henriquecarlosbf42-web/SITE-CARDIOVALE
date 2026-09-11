import type { Metadata } from "next";
import { Eye, Gem, Target } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { clinic } from "@/lib/data/clinic";

export const metadata: Metadata = {
  title: `A CardioVale | ${clinic.name}`,
};

const stats = [
  { label: "Atuando desde", value: clinic.foundedSince },
  { label: "Pacientes cadastrados", value: clinic.patientsServed },
  { label: "Exames realizados", value: clinic.examsPerformed },
];

const valores = [
  "Exceder às expectativas dos pacientes, oferecendo atendimento e equipamentos que associam credibilidade, ética e bons resultados",
  "Buscar o pleno potencial dos funcionários, estimulando a satisfação, a realização profissional e a integração deles ao ambiente de trabalho",
  "Cooperar, com postura de empresa cidadã, para o desenvolvimento das comunidades onde atua",
  "Favorecer o envolvimento de todos os parceiros, compartilhando riscos e resultados, mantendo a ética",
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Quem somos"
        title={clinic.legalName}
        description={`Referência em cardiologia em ${clinic.address.city}, atuando desde ${clinic.foundedSince}.`}
      />

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-ink-600">
              A CardioVale — {clinic.legalName} é referência em cardiologia em{" "}
              {clinic.address.city}, atuando desde {clinic.foundedSince} no
              atendimento especializado em consultas cardiológicas, prevenção,
              diagnóstico e tratamento de doenças cardiovasculares. Ao longo
              de sua trajetória, a clínica já cadastrou mais de{" "}
              {clinic.patientsServed.replace("+", "")} pacientes e realizou
              mais de {clinic.examsPerformed.replace("+", "")} exames
              cardiológicos, reforçando seu compromisso com a saúde do coração
              e a melhoria da qualidade de vida da população.
            </p>
            <p className="mt-4 text-ink-600">
              Nossa equipe é formada por cardiologistas renomados, com RQE —
              Registro de Qualificação de Especialista, continuamente
              atualizados e preparados pra acolher pacientes em diversas
              áreas da cardiologia, como Cardiologia Clínica, Cardiologia do
              Esporte, Ecocardiografia e Medicina de Emergência.
            </p>
            <p className="mt-4 text-ink-600">
              A CardioVale oferece uma estrutura completa pra realização de
              exames cardiológicos em {clinic.address.city}, incluindo
              Eletrocardiograma, Teste Ergométrico, Ecocardiograma
              Transtorácico com Doppler em Cores, Holter, MAPA
              (Monitorização Ambulatorial da Pressão Arterial) e outros
              exames essenciais pra avaliação e diagnóstico assertivo. Tudo
              isso com foco em excelência, segurança e resultados confiáveis.
            </p>
          </div>

          <Card className="flex flex-col gap-6 self-start text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="block text-2xl font-semibold text-brand-deep">
                  {stat.value}
                </span>
                <span className="text-sm text-ink-600">{stat.label}</span>
              </div>
            ))}
          </Card>
        </div>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <div className="flex flex-col items-center text-center">
              <Target className="h-6 w-6 text-brand" strokeWidth={1.75} />
              <h2 className="mt-4 font-semibold text-ink-900">Missão</h2>
            </div>
            <p className="mt-2 text-sm text-ink-600">
              Oferecer prestação de serviços médicos, garantindo a
              assistência à saúde dos pacientes, de forma humanizada, com
              qualidade e eficiência.
            </p>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center">
              <Eye className="h-6 w-6 text-brand" strokeWidth={1.75} />
              <h2 className="mt-4 font-semibold text-ink-900">Visão</h2>
            </div>
            <p className="mt-2 text-sm text-ink-600">
              Ser uma clínica médica referência na área de Cardiologia, com
              alta capacitação profissional e atendimento humanizado.
            </p>
          </Card>

          <Card>
            <div className="flex flex-col items-center text-center">
              <Gem className="h-6 w-6 text-brand" strokeWidth={1.75} />
              <h2 className="mt-4 font-semibold text-ink-900">Valores</h2>
            </div>
            <ul className="mt-2 space-y-2 text-sm text-ink-600">
              {valores.map((valor) => (
                <li key={valor} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                  {valor}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </>
  );
}
