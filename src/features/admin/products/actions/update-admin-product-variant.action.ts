"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import { updateAdminProductVariantSchema } from "../schemas/admin-product-variant.schema";

import {
  AdminProductVariantError,
  updateAdminProductVariant,
} from "../services/admin-product.service";

export interface UpdateAdminProductVariantState {
  status: "idle" | "error";

  message?: string;

  fieldErrors?: Record<string, string[]>;
}

interface DatabaseError {
  code?: unknown;
  constraint?: unknown;
  constraint_name?: unknown;
  cause?: unknown;
}

function getDatabaseError(error: unknown): DatabaseError | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const databaseError = error as DatabaseError;

  if (databaseError.code === "23505") {
    return databaseError;
  }

  if (typeof databaseError.cause === "object" && databaseError.cause !== null) {
    const cause = databaseError.cause as DatabaseError;

    if (cause.code === "23505") {
      return cause;
    }
  }

  return null;
}

function getConstraintName(error: DatabaseError) {
  if (typeof error.constraint_name === "string") {
    return error.constraint_name;
  }

  if (typeof error.constraint === "string") {
    return error.constraint;
  }

  return null;
}

export async function updateAdminProductVariantAction(
  _previousState: UpdateAdminProductVariantState,

  formData: FormData,
): Promise<UpdateAdminProductVariantState> {
  await requireAdmin();

  const result = updateAdminProductVariantSchema.safeParse({
    productId: formData.get("productId"),

    variantId: formData.get("variantId"),

    name: formData.get("name"),

    sku: formData.get("sku"),

    barcode: formData.get("barcode"),

    model: formData.get("model"),

    priceInCents: formData.get("price"),

    compareAtPriceInCents: formData.get("compareAtPrice"),

    purchaseEnabled: formData.get("purchaseEnabled") === "on",

    trackInventory: formData.get("trackInventory") === "on",

    stock: formData.get("stock"),

    allowBackorder: formData.get("allowBackorder") === "on",

    active: formData.get("active") === "on",

    isDefault: formData.get("isDefault") === "on",
  });

  if (!result.success) {
    return {
      status: "error",

      message: "Revisa los campos marcados.",

      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await updateAdminProductVariant(result.data);
  } catch (error) {
    if (error instanceof AdminProductVariantError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    const databaseError = getDatabaseError(error);

    if (databaseError) {
      const constraint = getConstraintName(databaseError);

      if (constraint === "product_variants_sku_unique") {
        return {
          status: "error",

          message: "Ya existe una variante con ese SKU.",

          fieldErrors: {
            sku: ["El SKU debe ser único"],
          },
        };
      }

      if (constraint === "product_variants_barcode_unique") {
        return {
          status: "error",

          message: "Ya existe una variante con ese código de barras.",

          fieldErrors: {
            barcode: ["El código de barras debe ser único"],
          },
        };
      }

      return {
        status: "error",

        message: "El SKU o código de barras ya está registrado.",
      };
    }

    console.error("No fue posible actualizar la variante:", error);

    return {
      status: "error",

      message: "No fue posible actualizar la variante. Inténtalo nuevamente.",
    };
  }

  const productId = result.data.productId;

  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${productId}/editar`);
  revalidatePath("/productos");

  redirect(
    `/admin/productos/${productId}/editar?step=variants&variantUpdated=1`,
  );
}
