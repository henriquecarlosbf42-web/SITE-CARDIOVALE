import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/ui/Card";
import { clinic } from "@/lib/data/clinic";

export const metadata: Metadata = {
  title: `Localização | ${clinic.name}`,
};

export default function LocalizacaoPage() {
  return (
    <>
      <PageHero
        eyebrow="Localização"
        title="Como chegar até a CardioVale"
        description={clinic.address.city}
      />
      <Container className="grid gap-6 py-16 sm:grid-cols-2">
        <Card>
          <MapPin className="h-6 w-6 text-brand" strokeWidth={1.75} />
          <h3 className="mt-4 font-semibold text-ink-900">Endereço</h3>
          <p className="mt-2 text-sm text-ink-600">
            {clinic.address.line}
            <br />
            {clinic.address.city}
          </p>
        </Card>

        <Card>
          <Clock className="h-6 w-6 text-brand" strokeWidth={1.75} />
          <h3 className="mt-4 font-semibold text-ink-900">Horário de atendimento</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-600">
            {clinic.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
        </Card>
      </Container>

      <Container className="pb-16">
        <Card className="overflow-hidden !p-0">
          <iframe
            src={clinic.address.mapsEmbedSrc}
            title="Localização da CardioVale no Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 sm:h-96"
          />
        </Card>
      </Container>
    </>
  );
}
