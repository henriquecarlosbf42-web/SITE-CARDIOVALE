import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/components/site/nav-links";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center px-6">
        <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-ink-900 transition-colors hover:text-brand-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3 xl:flex-none xl:gap-4">
          <Link href="/agendar-consulta">
            <Button variant="primary" className="whitespace-nowrap px-4 py-2 text-sm xl:px-5 xl:py-2.5">
              Agendar consulta
            </Button>
          </Link>
          <Link
            href="/area-do-paciente"
            className="whitespace-nowrap text-sm font-medium text-ink-900 hover:text-brand-deep"
          >
            Área do paciente
          </Link>
        </div>
      </div>
    </header>
  );
}
