import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { getNotifications } from "@/lib/data/patient-portal";
import { NotificationsList } from "./NotificationsList";

export const metadata: Metadata = { title: "Notificações | Portal do paciente" };

export default async function NotificacoesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await getNotifications(user.id);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-ink-900">Notificações</h1>
      <p className="mt-1 text-center text-sm text-ink-600">Avisos sobre seus exames e consultas.</p>

      <div className="mt-6">
        <NotificationsList notifications={notifications} />
      </div>
    </div>
  );
}
