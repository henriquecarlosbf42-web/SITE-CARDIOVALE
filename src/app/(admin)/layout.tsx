import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { roleCanAccess, HOME_BY_ROLE } from "@/lib/permissions/roles";
import { Logo } from "@/components/site/Logo";
import { signOut } from "@/app/login/actions";
import { firstName } from "@/lib/format";
import { AdminDock } from "./AdminDock";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!roleCanAccess("painel-admin", user.role)) redirect(HOME_BY_ROLE[user.role]);

  return (
    <div className="min-h-screen bg-surface-soft">
      <header className="border-b border-ink-100 bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo height={32} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-600">{firstName(user.fullName)} · {user.role}</span>
            <form action={signOut}>
              <button type="submit" className="text-sm font-medium text-brand-deep hover:underline">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 pb-28">{children}</main>

      <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
        <AdminDock />
      </div>
    </div>
  );
}
