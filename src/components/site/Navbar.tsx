"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/components/site/nav-links";

export function Navbar() {
  const [open, setOpen] = useState(false);

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

        <div className="hidden shrink-0 items-center gap-4 xl:flex">
          <Link href="/agendar-consulta">
            <Button variant="primary" className="whitespace-nowrap px-5 py-2.5">
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

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="ml-auto text-brand-deep xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-surface xl:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2.5 text-sm text-ink-900 hover:bg-brand-light hover:text-brand-deep"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/agendar-consulta" className="mt-2" onClick={() => setOpen(false)}>
              <Button variant="primary" className="w-full">
                Agendar consulta
              </Button>
            </Link>
            <Link
              href="/area-do-paciente"
              className="rounded-lg px-2 py-2.5 text-center text-sm font-medium text-ink-900 hover:bg-brand-light hover:text-brand-deep"
              onClick={() => setOpen(false)}
            >
              Área do paciente
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
