"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  adminCategoryImageSchema,
} from "../schemas/admin-category-image.schema";

import {
  AdminCategoryImageError,
  deleteAdminCategoryImage,
} from "../services/admin-category-image.service";

export interface DeleteAdminCategoryImageState {
  status: "idle" | "error";
  message?: string;
}

export async function deleteAdminCategoryImageAction(
  _previousState:
    DeleteAdminCategoryImageState,
  formData: FormData,
): Promise<DeleteAdminCategoryImageState> {
  await requireAdmin();

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
    };
  }

  try {
    await deleteAdminCategoryImage(
      result.data.categoryId,
    );
  } catch (error) {
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
      "No fue posible eliminar la imagen de la categoría:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible eliminar la imagen. Inténtalo nuevamente.",
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
    `/admin/categorias/${categoryId}/editar?imageDeleted=1`,
  );
}