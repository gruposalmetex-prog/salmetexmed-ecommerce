import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { resolveCart } from "@/features/cart/services/cart.service";

export const runtime = "nodejs";

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        const cart = await resolveCart(body);

        return NextResponse.json(cart);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error:
                        "Los datos del carrito no son válidos.",
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
                    error:
                        "El cuerpo de la petición no contiene JSON válido.",
                },
                {
                    status: 400,
                },
            );
        }

        console.error(
            "No se pudo resolver el carrito",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "No se pudo consultar el carrito.",
            },
            {
                status: 500,
            },
        );
    }
}