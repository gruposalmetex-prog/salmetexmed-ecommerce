import { getPublicProductBySlug } from "@/features/catalog/services/product.service";
import { NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{
        slug: string;
    }>;
}

export async function GET(_request: Request, context: RouteContext) {
    const { slug } = await context.params

    const product = await getPublicProductBySlug(slug);

    if (!product) {
        return NextResponse.json(
            {
                message: "Producto no encontrado",
            },
            {
                status: 404,
            }
        );
    }
    return NextResponse.json(product)
}