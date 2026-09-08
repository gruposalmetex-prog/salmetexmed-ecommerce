"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  createAdminBrandSchema,
} from "../schemas/admin-brand.schema";

import {
  AdminBrandError,
  createAdminBrand,
} from "../services/admin-brand.service";

export interface CreateAdminBrandState {
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

export async function createAdminBrandAction(
  _previousState: CreateAdminBrandState,
  formData: FormData,
): Promise<CreateAdminBrandState> {
  await requireAdmin();

  const result =
    createAdminBrandSchema.safeParse({
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

  try {
    await createAdminBrand(
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
          "Ya existe una marca con ese slug.",
      };
    }

    console.error(
      "No fue posible crear la marca:",
      error,
    );

    return {
      status: "error",
      message:
        "No fue posible guardar la marca. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/marcas");
  revalidatePath("/admin/productos/nuevo");
  revalidatePath("/productos");
  revalidatePath("/sitemap.xml");

  redirect(
    "/admin/marcas?created=1",
  );
}