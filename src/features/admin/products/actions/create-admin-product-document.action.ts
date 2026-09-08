"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
    createAdminProductDocumentSchema,
} from "../schemas/admin-product-document.schema";

import {
    AdminProductDocumentError,
    createAdminProductDocument,
} from "../services/admin-product-document.service";

import {
    ProductDocumentStorageError,
} from "../services/product-document-storage.service";

export interface CreateAdminProductDocumentState {
    status:
    | "idle"
    | "error";

    message?: string;

    fieldErrors?: Record<
        string,
        string[]
    >;
}

interface DatabaseError {
    code?: unknown;
    constraint?: unknown;
    constraint_name?: unknown;
    cause?: unknown;
}

function getDatabaseError(
    error: unknown,
): DatabaseError | null {
    if (
        typeof error !== "object" ||
        error === null
    ) {
        return null;
    }

    const databaseError =
        error as DatabaseError;

    if (
        databaseError.code === "23505"
    ) {
        return databaseError;
    }

    if (
        typeof databaseError.cause ===
        "object" &&
        databaseError.cause !== null
    ) {
        const cause =
            databaseError.cause as DatabaseError;

        if (cause.code === "23505") {
            return cause;
        }
    }

    return null;
}

function getConstraintName(
    error: DatabaseError,
) {
    if (
        typeof error.constraint_name ===
        "string"
    ) {
        return error.constraint_name;
    }

    if (
        typeof error.constraint ===
        "string"
    ) {
        return error.constraint;
    }

    return null;
}

export async function createAdminProductDocumentAction(
    _previousState:
        CreateAdminProductDocumentState,

    formData: FormData,
): Promise<CreateAdminProductDocumentState> {
    await requireAdmin();

    const intent =
        formData.get("intent") ===
            "continue"
            ? "continue"
            : "stay";

    const publicId =
        String(
            formData.get("publicId") ?? "",
        ).trim();

    const fileName =
        String(
            formData.get("fileName") ?? "",
        ).trim();

    if (!publicId) {
        return {
            status: "error",

            message:
                "Primero debes subir el documento a Cloudinary.",

            fieldErrors: {
                document: [
                    "El documento todavía no se ha subido",
                ],
            },
        };
    }

    if (
        !fileName ||
        fileName.length > 255
    ) {
        return {
            status: "error",

            message:
                "El nombre del archivo no es válido.",

            fieldErrors: {
                document: [
                    "Selecciona nuevamente el documento",
                ],
            },
        };
    }

    const result =
        createAdminProductDocumentSchema.safeParse({
            productId:
                formData.get("productId"),

            documentType:
                formData.get(
                    "documentType",
                ),

            title:
                formData.get("title"),
        });

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

    try {
        await createAdminProductDocument({
            ...result.data,
            publicId,
            fileName,
        });
    } catch (error) {
        if (
            error instanceof
            ProductDocumentStorageError
        ) {
            return {
                status: "error",

                message: error.message,

                fieldErrors: {
                    document: [
                        error.message,
                    ],
                },
            };
        }

        if (
            error instanceof
            AdminProductDocumentError
        ) {
            return {
                status: "error",
                message: error.message,
            };
        }

        const databaseError =
            getDatabaseError(error);

        if (databaseError) {
            const constraint =
                getConstraintName(
                    databaseError,
                );

            if (
                constraint ===
                "product_documents_product_type_unique"
            ) {
                return {
                    status: "error",

                    message:
                        "Este producto ya tiene un documento de ese tipo.",

                    fieldErrors: {
                        documentType: [
                            "Selecciona otro tipo de documento",
                        ],
                    },
                };
            }

            return {
                status: "error",

                message:
                    "No fue posible guardar el documento porque ya existe un registro equivalente.",
            };
        }

        console.error(
            "No fue posible crear el documento:",
            error,
        );

        return {
            status: "error",

            message:
                "No fue posible guardar el documento. Inténtalo nuevamente.",
        };
    }

    const productId =
        result.data.productId;

    revalidatePath("/admin");
    revalidatePath(
        "/admin/productos",
    );
    revalidatePath(
        `/admin/productos/${productId}/editar`,
    );

    const nextStep =
        intent === "continue"
            ? "review"
            : "documents";

    redirect(
        `/admin/productos/${productId}/editar?step=${nextStep}&documentCreated=1`,
    );
}