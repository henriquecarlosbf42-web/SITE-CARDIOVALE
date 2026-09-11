import Link from "next/link";
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

        <div className="flex flex-1 items-center justify-end xl:flex-none">
          <Link
            href="/area-do-paciente"
            className="whitespace-nowrap rounded-full bg-brand-deep px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand xl:px-5 xl:py-2.5"
          >
            Área do paciente
          </Link>
        </div>
      </div>
    </header>
  );
}
