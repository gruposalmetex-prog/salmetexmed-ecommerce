"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
    requireAdmin,
} from "@/features/admin/require-admin";

import {
    AdminProductPublicationError,
    unpublishAdminProduct,
} from "../services/admin-product.service";


export interface UnpublishAdminProductState {
    status: "idle" | "error";
    message?: string;
}

const productIdSchema = z.uuid();

export async function unpublishAdminProductAction(
    _previousState: UnpublishAdminProductState,
    formData: FormData,
): Promise<UnpublishAdminProductState> {
    await requireAdmin();

    const productIdResult =
        productIdSchema.safeParse(
            formData.get("productId"),
        );

    if (!productIdResult.success) {
        return {
            status: "error",
            message: "El identificador del producto no es válido."
        };
    };

    let unpublishedProduct: {
        id: string;
        slug: string;
    };

    try {
        unpublishedProduct =
            await unpublishAdminProduct(
                productIdResult.data
            )
    } catch (error) {
        if (
            error instanceof AdminProductPublicationError
        ) {
            return {
                status: "error",
                message: error.message,
            }
        }
        console.error(
            "No fue posible retirar la publicación del producto:",
            error,
        );

        return {
            status: "error",
            message:
                "No fue posible retirar la publicación del producto. Inténtalo nuevamente.",
        };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(
        "/admin/productos",
    );

    revalidatePath(
        `/admin/productos/${unpublishedProduct.id}/editar`,
    );

    revalidatePath("/productos");

    revalidatePath(
        `/productos/${unpublishedProduct.slug}`,
    );

    revalidatePath(
        "/sitemap.xml",
    );

    redirect(
        `/admin/productos/${unpublishedProduct.id}/editar?step=review&unpublished=1`,
    );
}