import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { getAllUsers } from "@/lib/data/admin";
import { UsersAdminList } from "./UsersAdminList";

export const metadata: Metadata = { title: "Usuários | Painel administrativo" };

export default async function AdminUsuariosPage() {
  const [users, currentUser] = await Promise.all([getAllUsers(), getCurrentUser()]);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Usuários</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{users.length} contas</p>

      <div className="mt-6">
        <UsersAdminList
          users={users.map((u) => ({ id: u.id, full_name: u.full_name, role: u.role, active: u.active }))}
          currentUserId={currentUser?.id ?? ""}
        />
      </div>
    </div>
  );
}
