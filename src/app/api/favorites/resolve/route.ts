import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { resolveFavorites } from "@/features/favorites/services/favorites.service";

import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit("favoritesResolve", request);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Has realizado demasiadas búsquedas. Espera un momento e inténtalo nuevamente.",
        },
        {
          status: 429,
          headers: rateLimit.headers,
        },
      );
    }

    const body = await request.json();

    const favorites = await resolveFavorites(body);

    return NextResponse.json(favorites, {
      headers: rateLimit.headers,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Los favoritos no son válidos.",
          issues: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "El cuerpo de la petición no contiene JSON válido.",
        },
        {
          status: 400,
        },
      );
    }

    console.error("No se pudieron resolver los favoritos", error);

    return NextResponse.json(
      {
        error: "No se pudieron consultar los favoritos.",
      },
      {
        status: 500,
      },
    );
  }
}
