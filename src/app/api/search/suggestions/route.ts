import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getPublicProductSearchSuggestions } from "@/features/catalog/services/product.service";

export const runtime = "nodejs";

export async function GET(
  request: Request,
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const query =
      searchParams.get("q");

    const suggestions =
      await getPublicProductSearchSuggestions(
        query,
      );

    return NextResponse.json(
      {
        suggestions,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error:
            "La búsqueda no es válida.",
          issues: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    console.error(
      "No se pudieron consultar las sugerencias",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudieron consultar las sugerencias.",
      },
      {
        status: 500,
      },
    );
  }
}