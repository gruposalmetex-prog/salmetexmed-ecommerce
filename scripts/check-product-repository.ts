import { config } from "dotenv";

import { getDatabaseClient } from "../src/db";
import { findProductBySlug } from "../src/features/catalog/repositories/product.repository";

config({ path: ".env.local" });

async function main() {
  const slug = process.argv[2];

  if (!slug) {
    throw new Error(
      "Debes proporcionar el slug: pnpm repository:check <slug>",
    );
  }

  try {
    const product = await findProductBySlug(slug);

    if (!product) {
      console.log(`No se encontró ningún producto con el slug "${slug}".`);
      return;
    }

    console.dir(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        status: product.status,
        saleMode: product.saleMode,

        brand: product.brand?.name ?? null,

        categories: product.categoryLinks.map(({ category }) => ({
          name: category.name,
          slug: category.slug,
          areas: category.areaLinks.map(({ area }) => ({
            name: area.name,
            slug: area.slug,
          })),
        })),

        variants: product.variants.map((variant) => ({
          name: variant.name,
          sku: variant.sku,
          priceInCents: variant.priceInCents,
          stock: variant.stock,
          active: variant.active,
          isDefault: variant.isDefault,
        })),

        images: product.images.map((image) => ({
          url: image.url,
          altText: image.altText,
          isPrimary: image.isPrimary,
        })),

        documents: product.documents.map((document) => ({
          title: document.title,
          type: document.documentType,
          url: document.url,
        })),
      },
      { depth: null },
    );
  } finally {
    await getDatabaseClient().end();
  }
}

main().catch((error: unknown) => {
  console.error("Error al consultar el producto:", error);
  process.exitCode = 1;
});