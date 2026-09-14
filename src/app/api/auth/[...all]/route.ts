import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  const pathname = new URL(request.url).pathname;

  const isEmailSignIn = pathname.endsWith("/sign-in/email");

  if (isEmailSignIn) {
    const rateLimit = await checkRateLimit("adminSignIn", request);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          message:
            "Demasiados intentos de acceso. Espera unos minutos antes de intentarlo nuevamente.",
        },
        {
          status: 429,
          headers: rateLimit.headers,
        },
      );
    }
  }
  return handlers.POST(request);
}
