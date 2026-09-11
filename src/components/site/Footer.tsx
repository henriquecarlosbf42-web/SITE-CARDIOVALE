import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Logo } from "@/components/site/Logo";
import { InstagramIcon } from "@/components/site/InstagramIcon";
import { navLinks } from "@/components/site/nav-links";
import { clinic } from "@/lib/data/clinic";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-surface-soft">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo height={40} />
          <p className="mt-3 text-sm text-ink-600">{clinic.tagline}.</p>
          <a
            href={clinic.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-brand-deep"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">Navegação</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ink-600 hover:text-brand-deep">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">Contato</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={clinic.phoneHref} className="hover:text-brand-deep">
                {clinic.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {clinic.address.line}
                <br />
                {clinic.address.city}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-900">Horário</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            {clinic.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-ink-100 py-6">
        <Container>
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} {clinic.name}. Todos os direitos reservados.
          </p>
        </Container>
      </div>
    </footer>
  );
}
