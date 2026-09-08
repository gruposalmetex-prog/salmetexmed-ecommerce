import "server-only";

import {
  and,
  asc,
  eq,
  sql,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
  productImages,
  products,
} from "@/db/schema";

import type {
  CreateAdminProductImageInput,
} from "../schemas/admin-product-image.schema";

export interface InsertAdminProductImageInput
  extends CreateAdminProductImageInput {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function findAdminProductImageContext(
  productId: string,
) {
  const db = getDatabase();

  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      status: products.status,
    })
    .from(products)
    .where(
      eq(
        products.id,
        productId,
      ),
    )
    .limit(1);

  return product ?? null;
}

export async function insertAdminProductImage(
  input: InsertAdminProductImageInput,
) {
  const db = getDatabase();

  return db.transaction(
    async (transaction) => {
      const [imageSummary] =
        await transaction
          .select({
            count: sql<number>`
              count(*)::int
            `,

            nextSortOrder: sql<number>`
              (
                coalesce(
                  max(${productImages.sortOrder}),
                  -1
                ) + 1
              )::int
            `,
          })
          .from(productImages)
          .where(
            eq(
              productImages.productId,
              input.productId,
            ),
          );

      const imageCount = Number(
        imageSummary?.count ?? 0,
      );

      const nextSortOrder = Number(
        imageSummary?.nextSortOrder ?? 0,
      );

      const isFirstImage =
        imageCount === 0;

      const shouldBePrimary =
        isFirstImage ||
        input.isPrimary;

      if (
        shouldBePrimary &&
        !isFirstImage
      ) {
        await transaction
          .update(productImages)
          .set({
            isPrimary: false,
          })
          .where(
            and(
              eq(
                productImages.productId,
                input.productId,
              ),
              eq(
                productImages.isPrimary,
                true,
              ),
            ),
          );
      }

      const [image] =
        await transaction
          .insert(productImages)
          .values({
            productId:
              input.productId,

            publicId:
              input.publicId,

            url:
              input.url,

            altText:
              input.altText,

            width:
              input.width,

            height:
              input.height,

            format:
              input.format,

            bytes:
              input.bytes,

            isPrimary:
              shouldBePrimary,

            sortOrder:
              nextSortOrder,
          })
          .returning({
            id:
              productImages.id,

            productId:
              productImages.productId,

            publicId:
              productImages.publicId,

            url:
              productImages.url,

            isPrimary:
              productImages.isPrimary,

            sortOrder:
              productImages.sortOrder,
          });

      if (!image) {
        throw new Error(
          "No fue posible guardar la imagen",
        );
      }

      return image;
    },
  );
}

export async function deleteAdminProductImageRecord(
  productId: string,
  imageId: string,
) {
  const db = getDatabase();

  return db.transaction(
    async (transaction) => {
      const [image] =
        await transaction
          .select({
            id: productImages.id,

            productId:
              productImages.productId,

            publicId:
              productImages.publicId,

            isPrimary:
              productImages.isPrimary,

            sortOrder:
              productImages.sortOrder,
          })
          .from(productImages)
          .where(
            and(
              eq(
                productImages.id,
                imageId,
              ),
              eq(
                productImages.productId,
                productId,
              ),
            ),
          )
          .limit(1);

      if (!image) {
        return null;
      }

      await transaction
        .delete(productImages)
        .where(
          and(
            eq(
              productImages.id,
              imageId,
            ),
            eq(
              productImages.productId,
              productId,
            ),
          ),
        );

      if (image.isPrimary) {
        const [nextImage] =
          await transaction
            .select({
              id: productImages.id,
            })
            .from(productImages)
            .where(
              eq(
                productImages.productId,
                productId,
              ),
            )
            .orderBy(
              asc(
                productImages.sortOrder,
              ),
            )
            .limit(1);

        if (nextImage) {
          await transaction
            .update(productImages)
            .set({
              isPrimary: true,
            })
            .where(
              eq(
                productImages.id,
                nextImage.id,
              ),
            );
        }
      }

      return image;
    },
  );
}

export async function findAdminProductImageByPublicId(publicId: string) {
  const db = getDatabase();

  const [image] = await db
    .select({
      id: productImages.id,
      productId: productImages.productId,
    })
    .from(productImages)
    .where(
      eq(
        productImages.publicId,
        publicId,
      )
    )
    .limit(1);
  return image ?? null;
}
