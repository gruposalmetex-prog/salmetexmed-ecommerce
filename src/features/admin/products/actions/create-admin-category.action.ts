"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  createAdminCategorySchema,
} from "../schemas/admin-category.schema";

import {
  AdminCategoryError,
  createAdminCategory,
} from "../services/admin-category.service";

export interface CreateAdminCategoryState {
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

export async function createAdminCategoryAction(
  _previousState: CreateAdminCategoryState,
  formData: FormData,
): Promise<CreateAdminCategoryState> {
  await requireAdmin();

  const result =
    createAdminCategorySchema.safeParse({
      name: formData.get("name"),

      slug: formData.get("slug"),

      shortDescription:
        formData.get("shortDescription"),

      description:
        formData.get("description"),

      active:
        formData.get("active") === "on",

      seoTitle:
        formData.get("seoTitle"),

      seoDescription:
        formData.get("seoDescription"),

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
        result.error.flatten().fieldErrors,
    };
  }

  try {
    await createAdminCategory(
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
          "Ya existe una categoría con ese slug.",
      };
    }

    console.error(
      "No fue posible crear la categoría:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible guardar la categoría. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath("/categorias");
  revalidatePath("/areas");
  revalidatePath("/productos");
  revalidatePath("/sitemap.xml");

  redirect(
    "/admin/categorias?created=1",
  );
}