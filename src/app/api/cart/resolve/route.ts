import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { resolveCart } from "@/features/cart/services/cart.service";

import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = await checkRateLimit("cartResolve", request);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Has realizado demasiadas consultas al carrito. Espera un momento.",
        },
        {
          status: 429,
          headers: rateLimit.headers,
        },
      );
    }
    const body = await request.json();
    const cart = await resolveCart(body);

    return NextResponse.json(cart, {
      headers: rateLimit.headers,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Los datos del carrito no son válidos.",
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

    console.error("No se pudo resolver el carrito", error);

    return NextResponse.json(
      {
        error: "No se pudo consultar el carrito.",
      },
      {
        status: 500,
      },
    );
  }
}
