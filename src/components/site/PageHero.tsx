import { Container } from "@/components/site/Container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-brand-deep py-16 text-white">
      <Container className="text-center">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wide text-white/70">
            {eyebrow}
          </p>
        )}
        <h1 className="mx-auto mt-2 max-w-2xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-white/80">{description}</p>
        )}
      </Container>
    </section>
  );
}
