"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { saveSubscription } from "./push-actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

type Status = "checking" | "idle" | "enabled" | "denied" | "unsupported" | "error";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function initialStatus(): Status {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "denied") return "denied";
  return "checking";
}

export function EnableNotificationsButton() {
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    if (status !== "checking") return;

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.pushManager.getSubscription())
      .then((subscription) => setStatus(subscription ? "enabled" : "idle"))
      .catch(() => setStatus("idle"));
  }, [status]);

  async function enable() {
    if (!VAPID_PUBLIC_KEY) {
      setStatus("error");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        setStatus("error");
        return;
      }

      const result = await saveSubscription({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      });

      setStatus(result.error ? "error" : "enabled");
    } catch {
      setStatus("error");
    }
  }

  if (status === "unsupported" || status === "checking") return null;

  if (status === "enabled") {
    return (
      <p className="mt-3 flex items-center gap-2 text-xs text-ink-600">
        <Bell className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
        Notificações ativadas
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={enable}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-ink-100 bg-white px-4 py-2 text-xs font-medium text-ink-900 transition-colors hover:bg-surface-soft"
    >
      {status === "denied" ? (
        <>
          <BellOff className="h-3.5 w-3.5" strokeWidth={1.75} />
          Notificações bloqueadas no navegador
        </>
      ) : (
        <>
          <Bell className="h-3.5 w-3.5" strokeWidth={1.75} />
          {status === "error" ? "Não deu pra ativar, tenta de novo" : "Ativar notificações"}
        </>
      )}
    </button>
  );
}
