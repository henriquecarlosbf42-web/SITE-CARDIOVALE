"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "cardiovale-install-prompt-dismissed";

function isMobileViewport() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function InstallAppPrompt() {
  const [prompt, setPrompt] = useState({ visible: false, ios: false });
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { visible, ios } = prompt;

  useEffect(() => {
    if (!isMobileViewport() || isStandalone()) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    // detecção de plataforma só existe no browser (SSR não tem
    // window/navigator) — por isso só dá pra decidir se mostra o
    // popup, e com qual variante, depois da montagem no cliente.
    if (isIos()) {
      // iOS não dispara beforeinstallprompt — sem esse evento pra
      // "assinar", não tem como decidir isso fora do efeito.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrompt({ visible: true, ios: true });
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setPrompt({ visible: true, ios: false });
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setPrompt((current) => ({ ...current, visible: false }));
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div className="w-full max-w-sm rounded-card border border-ink-100 bg-surface p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <Image
            src="/icon.png"
            alt="CardioVale"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-xl border border-ink-100"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-900">Instale o app da CardioVale</p>
            <p className="mt-1 text-sm text-ink-600">
              Acompanhe seus agendamentos, exames e resultados direto da tela inicial do seu
              celular, com acesso rápido e sem precisar abrir o navegador.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fechar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-surface-soft"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {ios ? (
          <p className="mt-4 rounded-lg bg-surface-soft px-3 py-2 text-xs text-ink-600">
            Toque em{" "}
            <Share className="mb-0.5 inline-block h-3.5 w-3.5" strokeWidth={1.75} /> e depois em{" "}
            <span className="font-medium text-ink-900">Adicionar à Tela de Início</span>
          </p>
        ) : (
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full border border-ink-100 bg-white px-4 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-soft"
            >
              Agora não
            </button>
            <button
              type="button"
              onClick={install}
              className="rounded-full bg-brand-deep px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand"
            >
              Instalar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
