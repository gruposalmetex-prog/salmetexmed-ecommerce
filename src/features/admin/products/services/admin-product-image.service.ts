import "server-only";

import type {
  CreateAdminProductImageInput,
} from "../schemas/admin-product-image.schema";

import {
  deleteAdminProductImageRecord,
  findAdminProductImageByPublicId,
  findAdminProductImageContext,
  insertAdminProductImage,
} from "../repositories/admin-product-image.repository";

import {
  deleteProductImage,
  isProductImagePublicId,
  verifyUploadedProductImage,
} from "./product-image-storage.service";

interface CreateAdminProductImageCommand
  extends CreateAdminProductImageInput {
  publicId: string;
}

export type AdminProductImageErrorCode =
  | "product_not_found"
  | "product_archived"
  | "image_not_found"
  | "image_already_registered";

export class AdminProductImageError extends Error {
  constructor(
    public readonly code:
      AdminProductImageErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "AdminProductImageError";
  }
}

export async function createAdminProductImage(
  command: CreateAdminProductImageCommand,
) {
  const product =
    await findAdminProductImageContext(
      command.productId,
    );

  if (!product) {
    throw new AdminProductImageError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (product.status === "archived") {
    throw new AdminProductImageError(
      "product_archived",
      "No puedes agregar imágenes a un producto archivado.",
    );
  }

  const registeredImage =
    await findAdminProductImageByPublicId(
      command.publicId,
    );

  if (registeredImage) {
    throw new AdminProductImageError(
      "image_already_registered",
      "La imagen ya fue registrada.",
    );
  }

  let verifiedImage;

  try {
    verifiedImage =
      await verifyUploadedProductImage(
        command.publicId,
        command.productId,
      );
  } catch (verificationError) {
    if (
      isProductImagePublicId(
        command.publicId,
        command.productId,
      )
    ) {
      try {
        await deleteProductImage(
          command.publicId,
        );
      } catch (cleanupError) {
        console.error(
          "No fue posible limpiar la imagen rechazada:",
          cleanupError,
        );
      }
    }

    throw verificationError;
  }

  try {
    return await insertAdminProductImage({
      productId:
        command.productId,

      altText:
        command.altText,

      isPrimary:
        command.isPrimary,

      publicId:
        verifiedImage.publicId,

      url:
        verifiedImage.url,

      width:
        verifiedImage.width,

      height:
        verifiedImage.height,

      format:
        verifiedImage.format,

      bytes:
        verifiedImage.bytes,
    });
  } catch (databaseError) {
    /*
     * Si dos solicitudes intentaron registrar el mismo
     * publicId simultáneamente, no eliminamos la imagen
     * que pudo registrar correctamente la otra solicitud.
     */
    const registeredAfterFailure =
      await findAdminProductImageByPublicId(
        verifiedImage.publicId,
      );

    if (!registeredAfterFailure) {
      try {
        await deleteProductImage(
          verifiedImage.publicId,
        );
      } catch (cleanupError) {
        console.error(
          "No fue posible limpiar la imagen de Cloudinary:",
          cleanupError,
        );
      }
    }

    throw databaseError;
  }
}

interface DeleteAdminProductImageCommand {
  productId: string;
  imageId: string;
}

export async function removeAdminProductImage(
  command:
    DeleteAdminProductImageCommand,
) {
  const product =
    await findAdminProductImageContext(
      command.productId,
    );

  if (!product) {
    throw new AdminProductImageError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (product.status === "archived") {
    throw new AdminProductImageError(
      "product_archived",
      "No puedes eliminar imágenes de un producto archivado.",
    );
  }

  const deletedImage =
    await deleteAdminProductImageRecord(
      command.productId,
      command.imageId,
    );

  if (!deletedImage) {
    throw new AdminProductImageError(
      "image_not_found",
      "La imagen no existe o no pertenece a este producto.",
    );
  }

  let storageCleanupFailed = false;

  try {
    await deleteProductImage(
      deletedImage.publicId,
    );
  } catch (error) {
    storageCleanupFailed = true;

    console.error(
      "La imagen se eliminó de PostgreSQL, pero no fue posible limpiarla de Cloudinary:",
      error,
    );
  }

  return {
    imageId:
      deletedImage.id,

    productId:
      deletedImage.productId,

    productSlug:
      product.slug,

    storageCleanupFailed,
  };
}