"use client";

import { useTransition } from "react";
import { Bell, BellRing } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Notifications as Notification } from "@/types/database";
import { markAllNotificationsRead, markNotificationRead } from "./actions";

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  const [pending, startTransition] = useTransition();
  const hasUnread = notifications.some((n) => !n.read_at);

  return (
    <div>
      {hasUnread && (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => markAllNotificationsRead())}
            className="mb-4 text-sm font-medium text-brand-deep hover:underline disabled:opacity-60"
          >
            Marcar todas como lidas
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-center text-sm text-ink-600">Nenhuma notificação ainda.</p>
      ) : (
        <div className="divide-y divide-ink-100 rounded-card border border-ink-100 bg-surface shadow-soft">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              disabled={!!notification.read_at || pending}
              onClick={() => startTransition(() => markNotificationRead(notification.id))}
              className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-surface-soft disabled:cursor-default"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  notification.read_at ? "bg-ink-100 text-ink-400" : "bg-brand-light text-brand-deep"
                }`}
              >
                {notification.read_at ? (
                  <Bell className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <BellRing className="h-4 w-4" strokeWidth={1.75} />
                )}
              </span>
              <span className="flex-1">
                <span className={`block text-sm ${notification.read_at ? "text-ink-600" : "font-semibold text-ink-900"}`}>
                  {notification.title}
                </span>
                {notification.body && <span className="mt-0.5 block text-sm text-ink-600">{notification.body}</span>}
                <span className="mt-1 block text-xs text-ink-400">{formatDateTime(notification.created_at)}</span>
              </span>
              {!notification.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-deep" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
