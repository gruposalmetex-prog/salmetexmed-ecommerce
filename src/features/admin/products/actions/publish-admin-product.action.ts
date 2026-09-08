"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  AdminProductPublicationError,
  publishAdminProduct,
} from "../services/admin-product.service";

export interface PublishAdminProductState {
  status: "idle" | "error";
  message?: string;
  missingRequirements?: string[];
}

const productIdSchema = z.uuid();

export async function publishAdminProductAction(
  _previousState:
    PublishAdminProductState,
  formData: FormData,
): Promise<PublishAdminProductState> {
  await requireAdmin();

  const productIdResult =
    productIdSchema.safeParse(
      formData.get("productId"),
    );

  if (!productIdResult.success) {
    return {
      status: "error",
      message:
        "El identificador del producto no es válido.",
    };
  }

  let publishedProduct: {
    id: string;
    slug: string;
  };

  try {
    publishedProduct =
      await publishAdminProduct(
        productIdResult.data,
      );
  } catch (error) {
    if (
      error instanceof
      AdminProductPublicationError
    ) {
      return {
        status: "error",
        message: error.message,
        missingRequirements:
          error.missingRequirements,
      };
    }

    console.error(
      "No fue posible publicar el producto:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible publicar el producto. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath(
    `/admin/productos/${publishedProduct.id}/editar`,
  );
  revalidatePath("/productos");
  revalidatePath(
    `/productos/${publishedProduct.slug}`,
  );
  revalidatePath("/sitemap.xml");

  redirect(
    `/admin/productos/${publishedProduct.id}/editar?step=review`,
  );
}