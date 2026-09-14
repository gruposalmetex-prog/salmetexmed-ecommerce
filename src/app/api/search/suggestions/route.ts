import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getPublicProductSearchSuggestions } from "@/features/catalog/services/product.service";

import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const rateLimit = await checkRateLimit("searchSuggestions", request);

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

    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q");

    const suggestions = await getPublicProductSearchSuggestions(query);

    return NextResponse.json(
      {
        suggestions,
      },
      {
        headers: {
          "Cache-Control": "no-store",

          ...rateLimit.headers,
        },
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "La búsqueda no es válida.",
          issues: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    console.error("No se pudieron consultar las sugerencias", error);

    return NextResponse.json(
      {
        error: "No se pudieron consultar las sugerencias.",
      },
      {
        status: 500,
      },
    );
  }
}
