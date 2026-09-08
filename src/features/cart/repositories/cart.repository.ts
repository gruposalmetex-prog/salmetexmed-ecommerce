import { getDatabase } from "@/db";

export async function findCartVariantsByIds(
  variantIds: string[],
) {
  if (variantIds.length === 0) {
    return [];
  }

  const db = getDatabase();

  return db.query.productVariants.findMany({
    where: (variants, { inArray }) =>
      inArray(variants.id, variantIds),

    columns: {
      id: true,
      name: true,
      sku: true,
      model: true,
      priceInCents: true,
      compareAtPriceInCents: true,
      purchaseEnabled: true,
      trackInventory: true,
      stock: true,
      allowBackorder: true,
      active: true,
    },

    with: {
      product: {
        columns: {
          id: true,
          name: true,
          slug: true,
          status: true,
          saleMode: true,
        },

        with: {
          brand: {
            columns: {
              name: true,
              active: true,
            },
          },

          images: {
            columns: {
              url: true,
              altText: true,
              width: true,
              height: true,
              isPrimary: true,
            },

            orderBy: (images, { desc, asc }) => [
              desc(images.isPrimary),
              asc(images.sortOrder),
            ],

            limit: 1,
          },
        },
      },
    },
  });
}

export type CartVariantRecord = Awaited<
  ReturnType<typeof findCartVariantsByIds>
>[number];