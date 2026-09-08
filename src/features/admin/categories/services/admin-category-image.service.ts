import "server-only";

import {
  clearAdminCategoryImage,
  findAdminCategoryImageContext,
  saveAdminCategoryImage as saveAdminCategoryImageRecord,
} from "../repositories/admin-category-image.repository";

import {
  deleteCatalogImage,
  verifyUploadedCatalogImage,
} from "@/features/admin/catalog-media/services/catalog-image-storage.service";

export type AdminCategoryImageErrorCode =
  | "category_not_found"
  | "image_save_failed"
  | "image_delete_failed";

export class AdminCategoryImageError extends Error {
  constructor(
    public readonly code:
      AdminCategoryImageErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "AdminCategoryImageError";
  }
}

function getCategoryImagePrefix(
  categoryId: string,
) {
  return `salmetexmed/categories/${categoryId}/images/`;
}

interface SaveAdminCategoryImageInput {
  categoryId: string;
  publicId: string;
}

export async function saveAdminCategoryImage(
  input: SaveAdminCategoryImageInput,
) {
  const category =
    await findAdminCategoryImageContext(
      input.categoryId,
    );

  if (!category) {
    throw new AdminCategoryImageError(
      "category_not_found",
      "La categoría no existe.",
    );
  }

  const uploadedImage =
    await verifyUploadedCatalogImage(
      input.publicId,
      getCategoryImagePrefix(
        category.id,
      ),
    );

  let updatedCategory;

  try {
    updatedCategory =
      await saveAdminCategoryImageRecord({
        categoryId: category.id,
        publicId:
          uploadedImage.publicId,
        url:
          uploadedImage.url,
      });
  } catch (error) {
    try {
      await deleteCatalogImage(
        uploadedImage.publicId,
      );
    } catch (cleanupError) {
      console.error(
        "No fue posible limpiar la imagen nueva de la categoría:",
        cleanupError,
      );
    }

    throw error;
  }

  if (!updatedCategory) {
    try {
      await deleteCatalogImage(
        uploadedImage.publicId,
      );
    } catch (cleanupError) {
      console.error(
        "No fue posible limpiar la imagen nueva de la categoría:",
        cleanupError,
      );
    }

    throw new AdminCategoryImageError(
      "image_save_failed",
      "No fue posible guardar la imagen de la categoría.",
    );
  }

  const previousPublicId =
    category.imagePublicId;

  if (
    previousPublicId &&
    previousPublicId !==
      uploadedImage.publicId
  ) {
    try {
      await deleteCatalogImage(
        previousPublicId,
      );
    } catch (error) {
      console.error(
        "No fue posible eliminar la imagen anterior de la categoría:",
        error,
      );
    }
  }

  return updatedCategory;
}

export async function deleteAdminCategoryImage(
  categoryId: string,
) {
  const category =
    await findAdminCategoryImageContext(
      categoryId,
    );

  if (!category) {
    throw new AdminCategoryImageError(
      "category_not_found",
      "La categoría no existe.",
    );
  }

  if (
    !category.imagePublicId
  ) {
    return {
      id: category.id,
      deleted: false,
    };
  }

  const publicId =
    category.imagePublicId;

  const clearedCategory =
    await clearAdminCategoryImage(
      category.id,
      publicId,
    );

  if (!clearedCategory) {
    throw new AdminCategoryImageError(
      "image_delete_failed",
      "No fue posible retirar la imagen de la categoría.",
    );
  }

  try {
    await deleteCatalogImage(
      publicId,
    );
  } catch (error) {
    console.error(
      "No fue posible eliminar de Cloudinary la imagen de la categoría:",
      error,
    );
  }

  return {
    id: category.id,
    deleted: true,
  };
}