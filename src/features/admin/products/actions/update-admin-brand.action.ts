"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  updateAdminBrandSchema,
} from "../schemas/admin-brand.schema";

import {
  AdminBrandError,
  updateAdminBrand,
} from "../services/admin-brand.service";

export interface UpdateAdminBrandState {
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

export async function updateAdminBrandAction(
  _previousState: UpdateAdminBrandState,
  formData: FormData,
): Promise<UpdateAdminBrandState> {
  await requireAdmin();

  const result =
    updateAdminBrandSchema.safeParse({
      id:
        formData.get("id"),

      name:
        formData.get("name"),

      slug:
        formData.get("slug"),

      description:
        formData.get(
          "description",
        ),

      active:
        formData.get("active") ===
        "on",
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

  let updatedBrand: {
    id: string;
    slug: string;
    previousSlug: string;
  };

  try {
    updatedBrand =
      await updateAdminBrand(
        result.data,
      );
  } catch (error) {
    if (
      error instanceof
      AdminBrandError
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
          "Ya existe otra marca con ese slug.",
      };
    }

    console.error(
      "No fue posible actualizar la marca:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible actualizar la marca. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/marcas");
  revalidatePath(
    `/admin/marcas/${updatedBrand.id}/editar`,
  );
  revalidatePath("/admin/productos/nuevo");

  revalidatePath(
    "/productos",
    "layout",
  );

  revalidatePath(
    `/marcas/${updatedBrand.previousSlug}`,
  );

  revalidatePath(
    `/marcas/${updatedBrand.slug}`,
  );

  revalidatePath("/sitemap.xml");

  redirect(
    `/admin/marcas/${updatedBrand.id}/editar?updated=1`,
  );
}