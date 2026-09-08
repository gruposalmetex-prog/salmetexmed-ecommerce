import type {
  CreateAdminAreaInput,
  UpdateAdminAreaInput,
} from "../schemas/admin-area.schema";

import {
  createAdminArea as createAdminAreaRecord,
  findAdminAreaById,
  findAdminAreaBySlug,
  listAdminAreas,
  updateAdminArea as updateAdminAreaRecord,
} from "../repositories/admin-area.repository";

export type AdminAreaErrorCode =
  | "area_not_found"
  | "area_slug_exists"
  | "area_creation_failed"
  | "area_update_failed";

export class AdminAreaError extends Error {
  constructor(
    public readonly code: AdminAreaErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "AdminAreaError";
  }
}

export async function getAdminAreas() {
  return listAdminAreas();
}

export async function getAdminAreaById(
  areaId: string,
) {
  return findAdminAreaById(
    areaId,
  );
}

export async function createAdminArea(
  input: CreateAdminAreaInput,
) {
  const existingArea =
    await findAdminAreaBySlug(
      input.slug,
    );

  if (existingArea) {
    throw new AdminAreaError(
      "area_slug_exists",
      "Ya existe un área con ese slug.",
    );
  }

  const area =
    await createAdminAreaRecord(
      input,
    );

  if (!area) {
    throw new AdminAreaError(
      "area_creation_failed",
      "No fue posible crear el área.",
    );
  }

  return area;
}

export async function updateAdminArea(
  input: UpdateAdminAreaInput,
) {
  const currentArea =
    await findAdminAreaById(
      input.id,
    );

  if (!currentArea) {
    throw new AdminAreaError(
      "area_not_found",
      "El área no existe.",
    );
  }

  const areaWithSlug =
    await findAdminAreaBySlug(
      input.slug,
    );

  if (
    areaWithSlug &&
    areaWithSlug.id !== input.id
  ) {
    throw new AdminAreaError(
      "area_slug_exists",
      "Ya existe otra área con ese slug.",
    );
  }

  const updatedArea =
    await updateAdminAreaRecord(
      input,
    );

  if (!updatedArea) {
    throw new AdminAreaError(
      "area_update_failed",
      "No fue posible actualizar el área.",
    );
  }

  return {
    ...updatedArea,
    previousSlug:
      currentArea.slug,
  };
}