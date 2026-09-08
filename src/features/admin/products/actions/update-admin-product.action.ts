"use server";

import {
  revalidatePath,
} from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  updateAdminProductSchema,
} from "../schemas/admin-product.schema";

import {
  AdminProductUpdateError,
  updateAdminProduct,
} from "../services/admin-product.service";

import {
  getAdminProductFormValues,
} from "./admin-product-form-data";

export interface UpdateAdminProductState {
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
    typeof error.cause ===
      "object" &&
    error.cause !== null &&
    "code" in error.cause &&
    error.cause.code ===
      "23505"
  ) {
    return true;
  }

  return false;
}

export async function updateAdminProductAction(
  _previousState:
    UpdateAdminProductState,

  formData: FormData,
): Promise<UpdateAdminProductState> {
  await requireAdmin();

  const result =
    updateAdminProductSchema.safeParse({
      productId:
        formData.get("productId"),

      ...getAdminProductFormValues(
        formData,
      ),
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

  let product: {
    id: string;
    slug: string;
    previousSlug: string;
  };

  try {
    product =
      await updateAdminProduct(
        result.data,
      );
  } catch (error) {
    if (
      error instanceof
      AdminProductUpdateError
    ) {
      return {
        status: "error",
        message: error.message,
      };
    }

    if (isUniqueViolation(error)) {
      return {
        status: "error",

        message:
          "Ya existe otro producto con ese slug.",

        fieldErrors: {
          slug: [
            "Utiliza un slug diferente.",
          ],
        },
      };
    }

    console.error(
      "No fue posible actualizar el producto:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible guardar los cambios. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(
    "/admin/productos",
  );

  revalidatePath(
    `/admin/productos/${product.id}/editar`,
  );

  revalidatePath("/productos");

  revalidatePath(
    `/productos/${product.slug}`,
  );

  if (
    product.previousSlug !==
    product.slug
  ) {
    revalidatePath(
      `/productos/${product.previousSlug}`,
    );
  }

  revalidatePath("/sitemap.xml");

  redirect(
    `/admin/productos/${product.id}/editar?step=general&updated=1`,
  );
}