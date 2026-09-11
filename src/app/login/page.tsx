import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { clinic } from "@/lib/data/clinic";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: `Entrar | ${clinic.name}`,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const cadastroHref = redirect ? `/cadastro?redirect=${encodeURIComponent(redirect)}` : "/cadastro";

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-soft px-6 py-16">
      <div className="w-full max-w-sm rounded-card border border-ink-100 bg-surface p-8 shadow-soft">
        <div className="flex justify-center">
          <Logo height={36} />
        </div>
        <h1 className="mt-6 text-center text-xl font-semibold text-ink-900">
          Entrar na sua conta
        </h1>
        <p className="mt-1 text-center text-sm text-ink-600">
          Acesse o portal do paciente, médico ou administrativo.
        </p>

        <div className="mt-6">
          <LoginForm redirectTo={redirect} />
        </div>

        <p className="mt-6 text-center text-sm text-ink-600">
          Ainda não tem conta?{" "}
          <Link href={cadastroHref} className="font-medium text-brand-deep hover:underline">
            Cadastre-se
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-ink-600 hover:text-brand-deep"
        >
          ← Voltar pro site
        </Link>
      </div>
    </main>
  );
}
