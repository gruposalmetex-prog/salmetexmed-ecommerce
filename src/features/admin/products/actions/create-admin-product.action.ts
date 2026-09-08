"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
    createAdminProductSchema,
} from "../schemas/admin-product.schema";

import {
    createAdminProduct,
} from "../services/admin-product.service";
import { getAdminProductFormValues } from "./admin-product-form-data";

export interface CreateAdminProductState {
    status:
    | "idle"
    | "error";

    message?: string;

    fieldErrors?: Record<
        string,
        string[]
    >;
}

function isUniqueViolation(
    error: unknown,
) {
    if (
        typeof error !== "object" ||
        error === null
    ) {
        return false;
    }

    if (
        "code" in error &&
        error.code === "23505"
    ) {
        return true;
    }

    if (
        "cause" in error &&
        typeof error.cause === "object" &&
        error.cause !== null &&
        "code" in error.cause &&
        error.cause.code === "23505"
    ) {
        return true;
    }

    return false;
}

export async function createAdminProductAction(
    _previousState:
        CreateAdminProductState,

    formData: FormData,
): Promise<CreateAdminProductState> {
    await requireAdmin();

    const result = createAdminProductSchema.safeParse(
        getAdminProductFormValues(
            formData,
        )
    )

    if (!result.success) {
        return {
            status: "error",

            message:
                "Revisa los campos marcados.",

            fieldErrors:
                result.error.flatten()
                    .fieldErrors,
        };
    }

    let product: {
        id: string;
        slug: string;
    };

    try {
        product =
            await createAdminProduct(
                result.data,
            );
    } catch (error) {
        if (isUniqueViolation(error)) {
            return {
                status: "error",

                message:
                    "Ya existe un producto con ese slug.",
            };
        }

        console.error(
            "No fue posible crear el producto:",
            error,
        );

        return {
            status: "error",

            message:
                "No fue posible guardar el producto. Inténtalo nuevamente.",
        };
    }

    revalidatePath("/admin");
    revalidatePath(
        "/admin/productos",
    );
    redirect(
        `/admin/productos/${product.id}/editar?step=variants`,
    );
}