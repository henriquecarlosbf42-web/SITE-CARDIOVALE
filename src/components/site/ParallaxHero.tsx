"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, FileHeart, UserRound } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/Button";
import { clinic } from "@/lib/data/clinic";

export function ParallaxHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const range = prefersReducedMotion ? 0 : 1;

  // camada 1 — fundo, a mais lenta
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 70 * range]);

  // camada 2 — logo, desloca pro canto superior esquerdo e cresce um pouco
  const logoX = useTransform(scrollYProgress, [0, 1], [0, -90 * range]);
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -70 * range]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.18 * range]);

  // camada 3 — casal, a mais rápida (primeiro plano)
  const yCouple = useTransform(scrollYProgress, [0, 1], [0, 120 * range]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[620px] overflow-hidden bg-white sm:min-h-[680px] lg:min-h-[760px]"
    >
      {/* camada 1 — fundo */}
      <motion.div aria-hidden style={{ y: yBack }} className="absolute inset-0">
        <Image
          src="/images/hero/fundo.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/30 to-transparent" />
      </motion.div>

      {/* camada 2 — logo flutuante, desloca e cresce ao rolar */}
      <motion.div
        aria-hidden
        style={{ x: logoX, y: logoY, scale: logoScale }}
        className="pointer-events-none absolute left-[8%] top-[14%] w-40 origin-top-left sm:w-52 lg:left-[10%] lg:top-[16%] lg:w-64"
      >
        <Image
          src="/images/hero/logo-float.webp"
          alt=""
          width={2606}
          height={594}
          className="h-auto w-full drop-shadow-sm"
        />
      </motion.div>

      {/* camada 3 — casal, primeiro plano */}
      <motion.div
        aria-hidden
        style={{ y: yCouple }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden items-end justify-end lg:flex"
      >
        <Image
          src="/images/hero/casal.webp"
          alt=""
          width={992}
          height={745}
          className="h-[82%] w-auto object-contain"
        />
      </motion.div>

      {/* conteúdo real — texto e CTAs */}
      <div className="relative">
        <Container className="py-20 lg:py-28">
          <div className="max-w-xl pt-16 sm:pt-20 lg:pt-24">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-600 sm:text-3xl">
              {clinic.headline}
            </h1>
            <p className="mt-4 max-w-md text-ink-600">{clinic.tagline}.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/agendar-consulta">
                <Button variant="primary">Agendar consulta</Button>
              </Link>
              <Link href="/agendar-exame">
                <Button variant="outline">Agendar exame</Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/area-do-paciente"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-deep"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-brand-deep/10">
                  <FileHeart className="h-4 w-4" />
                </span>
                Acessar resultados
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/area-do-paciente"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-deep"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-brand-deep/10">
                  <UserRound className="h-4 w-4" />
                </span>
                Área do paciente
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
