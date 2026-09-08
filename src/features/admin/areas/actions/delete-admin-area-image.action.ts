"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  adminAreaImageSchema,
} from "../schemas/admin-area-image.schema";

import {
  AdminAreaImageError,
  deleteAdminAreaImage,
} from "../services/admin-area-image.service";

export interface DeleteAdminAreaImageState {
  status: "idle" | "error";
  message?: string;
}

export async function deleteAdminAreaImageAction(
  _previousState:
    DeleteAdminAreaImageState,
  formData: FormData,
): Promise<DeleteAdminAreaImageState> {
  await requireAdmin();

  const result =
    adminAreaImageSchema.safeParse({
      areaId:
        formData.get("areaId"),
    });

  if (!result.success) {
    return {
      status: "error",
      message:
        "El identificador del área no es válido.",
    };
  }

  try {
    await deleteAdminAreaImage(
      result.data.areaId,
    );
  } catch (error) {
    if (
      error instanceof
      AdminAreaImageError
    ) {
      return {
        status: "error",
        message: error.message,
      };
    }

    console.error(
      "No fue posible eliminar la imagen del área:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible eliminar la imagen. Inténtalo nuevamente.",
    };
  }

  const areaId =
    result.data.areaId;

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/areas");
  revalidatePath("/admin/categorias");

  revalidatePath(
    `/admin/areas/${areaId}/editar`,
  );

  revalidatePath("/areas");
  revalidatePath("/categorias");
  revalidatePath("/productos");

  redirect(
    `/admin/areas/${areaId}/editar?imageDeleted=1`,
  );
}