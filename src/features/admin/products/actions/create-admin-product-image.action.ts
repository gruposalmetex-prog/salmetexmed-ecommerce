"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  createAdminProductImageSchema,
} from "../schemas/admin-product-image.schema";

import {
  AdminProductImageError,
  createAdminProductImage,
} from "../services/admin-product-image.service";

import {
  ProductImageStorageError,
} from "../services/product-image-storage.service";

export interface CreateAdminProductImageState {
  status:
    | "idle"
    | "error";

  message?: string;

  fieldErrors?: Record<
    string,
    string[]
  >;
}

export async function createAdminProductImageAction(
  _previousState:
    CreateAdminProductImageState,

  formData: FormData,
): Promise<CreateAdminProductImageState> {
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

  if (
    !publicId ||
    publicId.length > 255
  ) {
    return {
      status: "error",

      message:
        "Primero debes subir la imagen a Cloudinary.",

      fieldErrors: {
        image: [
          "La imagen todavía no se ha subido",
        ],
      },
    };
  }

  const result =
    createAdminProductImageSchema.safeParse({
      productId:
        formData.get("productId"),

      altText:
        formData.get("altText"),

      isPrimary:
        formData.get(
          "isPrimary",
        ) === "on",
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
    await createAdminProductImage({
      ...result.data,
      publicId,
    });
  } catch (error) {
    if (
      error instanceof
      ProductImageStorageError
    ) {
      return {
        status: "error",

        message: error.message,

        fieldErrors: {
          image: [
            error.message,
          ],
        },
      };
    }

    if (
      error instanceof
      AdminProductImageError
    ) {
      return {
        status: "error",
        message: error.message,
      };
    }

    console.error(
      "No fue posible crear la imagen:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible guardar la imagen. Inténtalo nuevamente.",
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
      ? "documents"
      : "images";

  redirect(
    `/admin/productos/${productId}/editar?step=${nextStep}&imageCreated=1`,
  );
}