"use server";

import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  AdminProductDocumentError,
  removeAdminProductDocument,
} from "../services/admin-product-document.service";

export interface DeleteAdminProductDocumentState {
  status:
    | "idle"
    | "error";

  message?: string;
}

const deleteDocumentSchema =
  z.object({
    productId: z.uuid(
      "El producto no es válido.",
    ),

    documentId: z.uuid(
      "El documento no es válido.",
    ),
  });

export async function deleteAdminProductDocumentAction(
  _previousState:
    DeleteAdminProductDocumentState,

  formData: FormData,
): Promise<DeleteAdminProductDocumentState> {
  await requireAdmin();

  const result =
    deleteDocumentSchema.safeParse({
      productId:
        formData.get("productId"),

      documentId:
        formData.get("documentId"),
    });

  if (!result.success) {
    return {
      status: "error",
      message:
        "Los datos del documento no son válidos.",
    };
  }

  let deletedDocument: {
    productId: string;
    productSlug: string;
  };

  try {
    deletedDocument =
      await removeAdminProductDocument(
        result.data,
      );
  } catch (error) {
    if (
      error instanceof
      AdminProductDocumentError
    ) {
      return {
        status: "error",
        message: error.message,
      };
    }

    console.error(
      "No fue posible eliminar el documento:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible eliminar el documento. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/productos",
  );
  revalidatePath(
    `/admin/productos/${deletedDocument.productId}/editar`,
  );
  revalidatePath("/productos");
  revalidatePath(
    `/productos/${deletedDocument.productSlug}`,
  );
  revalidatePath("/sitemap.xml");

  redirect(
    `/admin/productos/${deletedDocument.productId}/editar?step=documents`,
  );
}