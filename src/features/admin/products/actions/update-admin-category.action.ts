"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  updateAdminCategorySchema,
} from "../schemas/admin-category.schema";

import {
  AdminCategoryError,
  updateAdminCategory,
} from "../services/admin-category.service";

export interface UpdateAdminCategoryState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
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
    typeof error.cause === "object" &&
    error.cause !== null &&
    "code" in error.cause &&
    error.cause.code === "23505"
  ) {
    return true;
  }

  return false;
}

export async function updateAdminCategoryAction(
  _previousState: UpdateAdminCategoryState,
  formData: FormData,
): Promise<UpdateAdminCategoryState> {
  await requireAdmin();

  const result =
    updateAdminCategorySchema.safeParse({
      id: formData.get("id"),

      name: formData.get("name"),

      slug: formData.get("slug"),

      shortDescription:
        formData.get(
          "shortDescription",
        ),

      description:
        formData.get("description"),

      active:
        formData.get("active") ===
        "on",

      seoTitle:
        formData.get("seoTitle"),

      seoDescription:
        formData.get(
          "seoDescription",
        ),

      areaIds:
        formData
          .getAll("areaIds")
          .map(String),
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

  let updatedCategory: {
    id: string;
    slug: string;
    previousSlug: string;
  };

  try {
    updatedCategory =
      await updateAdminCategory(
        result.data,
      );
  } catch (error) {
    if (
      error instanceof
      AdminCategoryError
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
          "Ya existe otra categoría con ese slug.",
      };
    }

    console.error(
      "No fue posible actualizar la categoría:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible actualizar la categoría. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");

  revalidatePath(
    `/admin/categorias/${updatedCategory.id}/editar`,
  );

  revalidatePath("/categorias");
  revalidatePath("/areas");
  revalidatePath("/productos");

  revalidatePath(
    `/categorias/${updatedCategory.previousSlug}`,
  );

  revalidatePath(
    `/categorias/${updatedCategory.slug}`,
  );

  revalidatePath("/sitemap.xml");

  redirect(
    `/admin/categorias/${updatedCategory.id}/editar?updated=1`,
  );
}