"use server";

import { createClient } from "@/lib/supabase/server";

export interface SaveSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function saveSubscription(input: SaveSubscriptionInput): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sem sessão." };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: input.endpoint,
      p256dh: input.p256dh,
      auth: input.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) return { error: "Não deu pra ativar as notificações. Tenta de novo." };
  return {};
}
