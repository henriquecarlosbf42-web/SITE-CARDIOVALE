import { Container } from "@/components/site/Container";
import { GoogleRatingBadge } from "@/components/site/GoogleRatingBadge";
import { ReviewsMarquee } from "@/components/site/ReviewsMarquee";
import { reviews } from "@/lib/data/reviews";

export function ReviewsSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Avaliações
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-3xl">
            O que nossos pacientes dizem
          </h2>
          <div className="mt-6 flex justify-center">
            <GoogleRatingBadge />
          </div>
        </div>

        <div className="mt-10">
          {reviews.length > 0 ? (
            <ReviewsMarquee reviews={reviews} />
          ) : (
            <p className="text-center text-sm text-ink-600">
              Avaliações completas dos pacientes chegando em breve.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
