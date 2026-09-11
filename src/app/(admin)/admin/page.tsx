import { getCurrentUser } from "@/lib/auth/session";

export default async function PainelAdminPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Olá, {user?.fullName}</h1>
      <p className="mt-2 text-sm text-ink-600">
        Painel administrativo ({user?.role}) — cadastros, agenda e conteúdo do site chegam na Etapa 9.
      </p>
    </div>
  );
}
