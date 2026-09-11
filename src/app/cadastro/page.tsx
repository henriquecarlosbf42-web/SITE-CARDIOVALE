import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { clinic } from "@/lib/data/clinic";
import { CadastroForm } from "./CadastroForm";

export const metadata: Metadata = {
  title: `Criar conta | ${clinic.name}`,
};

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect ?? "/portal";
  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-soft px-6 py-16">
      <div className="w-full max-w-sm rounded-card border border-ink-100 bg-surface p-8 shadow-soft">
        <div className="flex justify-center">
          <Logo height={36} />
        </div>
        <h1 className="mt-6 text-center text-xl font-semibold text-ink-900">Criar sua conta</h1>
        <p className="mt-1 text-center text-sm text-ink-600">
          Acesse o portal do paciente e agende consultas e exames online.
        </p>

        <div className="mt-6">
          <CadastroForm redirectTo={redirectTo} />
        </div>

        <p className="mt-6 text-center text-sm text-ink-600">
          Já tem conta?{" "}
          <Link href={loginHref} className="font-medium text-brand-deep hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
