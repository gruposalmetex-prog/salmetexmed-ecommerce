"use server";

import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  AdminProductImageError,
  removeAdminProductImage,
} from "../services/admin-product-image.service";

export interface DeleteAdminProductImageState {
  status:
    | "idle"
    | "error";

  message?: string;
}

const deleteImageSchema = z.object({
  productId: z.uuid(
    "El producto no es válido.",
  ),

  imageId: z.uuid(
    "La imagen no es válida.",
  ),
});

export async function deleteAdminProductImageAction(
  _previousState:
    DeleteAdminProductImageState,

  formData: FormData,
): Promise<DeleteAdminProductImageState> {
  await requireAdmin();

  const result =
    deleteImageSchema.safeParse({
      productId:
        formData.get("productId"),

      imageId:
        formData.get("imageId"),
    });

  if (!result.success) {
    return {
      status: "error",
      message:
        "Los datos de la imagen no son válidos.",
    };
  }

  let deletedImage: {
    productId: string;
    productSlug: string;
  };

  try {
    deletedImage =
      await removeAdminProductImage(
        result.data,
      );
  } catch (error) {
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
      "No fue posible eliminar la imagen:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible eliminar la imagen. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/productos",
  );
  revalidatePath(
    `/admin/productos/${deletedImage.productId}/editar`,
  );
  revalidatePath("/productos");
  revalidatePath(
    `/productos/${deletedImage.productSlug}`,
  );
  revalidatePath("/sitemap.xml");

  redirect(
    `/admin/productos/${deletedImage.productId}/editar?step=images`,
  );
}