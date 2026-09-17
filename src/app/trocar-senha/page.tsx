import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { clinic } from "@/lib/data/clinic";
import { getCurrentUser } from "@/lib/auth/session";
import { HOME_BY_ROLE } from "@/lib/permissions/roles";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata: Metadata = {
  title: `Trocar senha | ${clinic.name}`,
};

export default async function TrocarSenhaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.mustChangePassword) redirect(HOME_BY_ROLE[user.role]);

  return (
    <main className="portal-bg flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-card border border-ink-100 bg-surface p-8 shadow-soft">
        <div className="flex justify-center">
          <Logo height={36} />
        </div>
        <h1 className="mt-6 text-center text-xl font-semibold text-ink-900">Crie sua senha</h1>
        <p className="mt-1 text-center text-sm text-ink-600">
          Por segurança, antes de continuar você precisa trocar a senha padrão por uma só sua.
        </p>

        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
