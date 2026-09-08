import type {
  CreateAdminCategoryInput,
  UpdateAdminCategoryInput,
} from "../schemas/admin-category.schema";

import {
  createAdminCategory as createAdminCategoryRecord,
  findActiveAdminAreaIds,
  findAdminCategoryById,
  findAdminCategoryBySlug,
  findExistingAdminAreaIds,
  listAdminCategories,
  listAdminCategoryEditFormOptions,
  listAdminCategoryFormOptions,
  updateAdminCategory as updateAdminCategoryRecord,
} from "../repositories/admin-category.repository";

export type AdminCategoryErrorCode =
  | "category_not_found"
  | "category_slug_exists"
  | "invalid_areas"
  | "category_creation_failed"
  | "category_update_failed";

export class AdminCategoryError extends Error {
  constructor(
    public readonly code: AdminCategoryErrorCode,
    message: string,
  ) {
    super(message);

    this.name = "AdminCategoryError";
  }
}

export async function getAdminCategories() {
  return listAdminCategories();
}

export async function getAdminCategoryById(
  categoryId: string,
) {
  return findAdminCategoryById(
    categoryId,
  );
}

export async function getAdminCategoryFormOptions() {
  return listAdminCategoryFormOptions();
}

async function validateCategoryAreas(
  areaIds: string[],
) {
  if (areaIds.length === 0) {
    return;
  }

  const activeAreas =
    await findActiveAdminAreaIds(
      areaIds,
    );

  if (
    activeAreas.length !==
    areaIds.length
  ) {
    throw new AdminCategoryError(
      "invalid_areas",
      "Una o más áreas seleccionadas no existen o están inactivas.",
    );
  }
}

export async function createAdminCategory(
  input: CreateAdminCategoryInput,
) {
  const existingCategory =
    await findAdminCategoryBySlug(
      input.slug,
    );

  if (existingCategory) {
    throw new AdminCategoryError(
      "category_slug_exists",
      "Ya existe una categoría con ese slug.",
    );
  }

  await validateCategoryAreas(
    input.areaIds,
  );

  const category =
    await createAdminCategoryRecord(
      input,
    );

  if (!category) {
    throw new AdminCategoryError(
      "category_creation_failed",
      "No fue posible crear la categoría.",
    );
  }

  return category;
}

export async function updateAdminCategory(
  input: UpdateAdminCategoryInput,
) {
  const currentCategory =
    await findAdminCategoryById(
      input.id,
    );

  if (!currentCategory) {
    throw new AdminCategoryError(
      "category_not_found",
      "La categoría no existe.",
    );
  }

  const categoryWithSlug =
    await findAdminCategoryBySlug(
      input.slug,
    );

  if (
    categoryWithSlug &&
    categoryWithSlug.id !== input.id
  ) {
    throw new AdminCategoryError(
      "category_slug_exists",
      "Ya existe otra categoría con ese slug.",
    );
  }

  await validateExistingCategoryAreas(
    input.areaIds,
  );

  const newlyRelatedAreaIds =
    input.areaIds.filter(
      (areaId) =>
        !currentCategory.areaIds.includes(
          areaId,
        ),
    );

  await validateCategoryAreas(
    newlyRelatedAreaIds,
  );

  const updatedCategory =
    await updateAdminCategoryRecord(
      input,
    );

  if (!updatedCategory) {
    throw new AdminCategoryError(
      "category_update_failed",
      "No fue posible actualizar la categoría.",
    );
  }

  return {
    ...updatedCategory,
    previousSlug:
      currentCategory.slug
  }
}

export async function getAdminCategoryEditFormOptions() {
  return listAdminCategoryEditFormOptions();
}

async function validateExistingCategoryAreas(
  areaIds: string[],
) {
  if (areaIds.length === 0) {
    return;
  }

  const existingAreas =
    await findExistingAdminAreaIds(
      areaIds,
    );

  if (
    existingAreas.length !==
    areaIds.length
  ) {
    throw new AdminCategoryError(
      "invalid_areas",
      "Una o más áreas seleccionadas no existen.",
    );
  }
}