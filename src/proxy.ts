import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * roda em tudo, menos assets estáticos e imagens do Next —
     * precisa rodar nas rotas autenticadas pra renovar a sessão
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
