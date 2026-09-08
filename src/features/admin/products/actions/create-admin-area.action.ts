"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/require-admin";

import {
  createAdminAreaSchema,
} from "../schemas/admin-area.schema";

import {
  AdminAreaError,
  createAdminArea,
} from "../services/admin-area.service";

export interface CreateAdminAreaState {
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

export async function createAdminAreaAction(
  _previousState: CreateAdminAreaState,
  formData: FormData,
): Promise<CreateAdminAreaState> {
  await requireAdmin();

  const result =
    createAdminAreaSchema.safeParse({
      name:
        formData.get("name"),

      slug:
        formData.get("slug"),

      shortDescription:
        formData.get(
          "shortDescription",
        ),

      description:
        formData.get("description"),

      active:
        formData.get("active") ===
        "on",

      sortOrder:
        formData.get("sortOrder") ??
        "0",

      seoTitle:
        formData.get("seoTitle"),

      seoDescription:
        formData.get(
          "seoDescription",
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

  try {
    await createAdminArea(
      result.data,
    );
  } catch (error) {
    if (
      error instanceof
      AdminAreaError
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
          "Ya existe un área con ese slug.",
      };
    }

    console.error(
      "No fue posible crear el área:",
      error,
    );

    return {
      status: "error",

      message:
        "No fue posible guardar el área. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/areas");
  revalidatePath("/areas");
  revalidatePath("/categorias");
  revalidatePath("/productos");
  revalidatePath("/sitemap.xml");

  redirect(
    "/admin/areas?created=1",
  );
}