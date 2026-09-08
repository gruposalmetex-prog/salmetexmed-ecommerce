"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  CatalogImageStorageError,
} from "@/features/admin/catalog-media/services/catalog-image-storage.service";

import {
  adminAreaImageSchema,
} from "../schemas/admin-area-image.schema";

import {
  AdminAreaImageError,
  saveAdminAreaImage,
} from "../services/admin-area-image.service";

export interface SaveAdminAreaImageState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function saveAdminAreaImageAction(
  _previousState:
    SaveAdminAreaImageState,
  formData: FormData,
): Promise<SaveAdminAreaImageState> {
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

      message: "Primero debes subir la imagen a Cloudinary.",

      fieldErrors: {
        image: [
          "La imagen todavía no se ha subido.",
        ],
      },
    };
  }

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

      fieldErrors:
        result.error.flatten()
          .fieldErrors,
    };
  }

  try {
    await saveAdminAreaImage({
      areaId:
        result.data.areaId,

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
      AdminAreaImageError
    ) {
      return {
        status: "error",
        message: error.message,
      };
    }

    console.error(
      "No fue posible guardar la imagen del área:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible guardar la imagen. Inténtalo nuevamente.",
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
    `/admin/areas/${areaId}/editar?imageUpdated=1`,
  );
}