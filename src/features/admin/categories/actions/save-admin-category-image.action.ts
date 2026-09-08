"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  CatalogImageStorageError,
} from "@/features/admin/catalog-media/services/catalog-image-storage.service";

import {
  adminCategoryImageSchema,
} from "../schemas/admin-category-image.schema";

import {
  AdminCategoryImageError,
  saveAdminCategoryImage,
} from "../services/admin-category-image.service";

export interface SaveAdminCategoryImageState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function saveAdminCategoryImageAction(
  _previousState:
    SaveAdminCategoryImageState,
  formData: FormData,
): Promise<SaveAdminCategoryImageState> {
  await requireAdmin();

  const publicId =
    String(
      formData.get("publicId") ??
        "",
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
          "La imagen todavía no se ha subido.",
        ],
      },
    };
  }

  const result =
    adminCategoryImageSchema.safeParse({
      categoryId:
        formData.get("categoryId"),
    });

  if (!result.success) {
    return {
      status: "error",

      message:
        "El identificador de la categoría no es válido.",

      fieldErrors:
        result.error.flatten()
          .fieldErrors,
    };
  }

  try {
    await saveAdminCategoryImage({
      categoryId:
        result.data.categoryId,

      publicId,
    });
  } catch (error) {
    if (
      error instanceof
      CatalogImageStorageError
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
      AdminCategoryImageError
    ) {
      return {
        status: "error",
        message: error.message,
      };
    }

    console.error(
      "No fue posible guardar la imagen de la categoría:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible guardar la imagen. Inténtalo nuevamente.",
    };
  }

  const categoryId =
    result.data.categoryId;

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");

  revalidatePath(
    `/admin/categorias/${categoryId}/editar`,
  );

  revalidatePath("/categorias");
  revalidatePath("/areas");
  revalidatePath("/productos");

  redirect(
    `/admin/categorias/${categoryId}/editar?imageUpdated=1`,
  );
}