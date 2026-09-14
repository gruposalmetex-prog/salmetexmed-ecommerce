import { getPublicProductBySlug } from "@/features/catalog/services/product.service";
import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const rateLimit = await checkRateLimit("productDetails", request);

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
    const { slug } = await context.params;

    const product = await getPublicProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          message: "Producto no encontrado",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(product, {
      headers: rateLimit.headers,
    });
  } catch (error) {
    console.error("No se pudo consultar el producto", error);

    return NextResponse.json(
      {
        error: "No se pudo consultar el producto.",
      },
      {
        status: 500,
      },
    );
  }
}
