import "server-only";

import {
  clearAdminAreaImage,
  findAdminAreaImageContext,
  saveAdminAreaImage as saveAdminAreaImageRecord,
} from "../repositories/admin-area-image.repository";

import {
  deleteCatalogImage,
  verifyUploadedCatalogImage,
} from "@/features/admin/catalog-media/services/catalog-image-storage.service";

export type AdminAreaImageErrorCode =
  | "area_not_found"
  | "image_save_failed"
  | "image_delete_failed";

export class AdminAreaImageError extends Error {
  constructor(
    public readonly code:
      AdminAreaImageErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "AdminAreaImageError";
  }
}

function getAreaImagePrefix(
  areaId: string,
) {
  return `salmetexmed/areas/${areaId}/images/`;
}

interface SaveAdminAreaImageInput {
  areaId: string;
  publicId: string;
}

export async function saveAdminAreaImage(
  input: SaveAdminAreaImageInput,
) {
  const area =
    await findAdminAreaImageContext(
      input.areaId,
    );

  if (!area) {
    throw new AdminAreaImageError(
      "area_not_found",
      "El área no existe.",
    );
  }

  const uploadedImage =
    await verifyUploadedCatalogImage(
      input.publicId,
      getAreaImagePrefix(
        area.id,
      ),
    );

  let updatedArea;

  try {
    updatedArea =
      await saveAdminAreaImageRecord({
        areaId: area.id,
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
        "No fue posible limpiar la imagen nueva del área:",
        cleanupError,
      );
    }

    throw error;
  }

  if (!updatedArea) {
    try {
      await deleteCatalogImage(
        uploadedImage.publicId,
      );
    } catch (cleanupError) {
      console.error(
        "No fue posible limpiar la imagen nueva del área:",
        cleanupError,
      );
    }

    throw new AdminAreaImageError(
      "image_save_failed",
      "No fue posible guardar la imagen del área.",
    );
  }

  const previousPublicId =
    area.imagePublicId;

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
        "No fue posible eliminar la imagen anterior del área:",
        error,
      );
    }
  }

  return updatedArea;
}

export async function deleteAdminAreaImage(
  areaId: string,
) {
  const area =
    await findAdminAreaImageContext(
      areaId,
    );

  if (!area) {
    throw new AdminAreaImageError(
      "area_not_found",
      "El área no existe.",
    );
  }

  if (!area.imagePublicId) {
    return {
      id: area.id,
      deleted: false,
    };
  }

  const publicId =
    area.imagePublicId;

  const clearedArea =
    await clearAdminAreaImage(
      area.id,
      publicId,
    );

  if (!clearedArea) {
    throw new AdminAreaImageError(
      "image_delete_failed",
      "No fue posible retirar la imagen del área.",
    );
  }

  try {
    await deleteCatalogImage(
      publicId,
    );
  } catch (error) {
    console.error(
      "No fue posible eliminar de Cloudinary la imagen del área:",
      error,
    );
  }

  return {
    id: area.id,
    deleted: true,
  };
}