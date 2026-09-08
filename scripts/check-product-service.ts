import { config } from "dotenv";

import {findProductBySlug,} from "../src/features/catalog/repositories/product.repository";

import {getPublicProductBySlug} from "../src/features/catalog/services/product.service";

import { getDatabaseClient } from "../src/db";

config({ path: ".env.local" });

const productSlug = "oximetro-pulso-demo";

async function checkProductService() {
  try {
    const administrativeProduct =
      await findProductBySlug(productSlug);

    const publicProduct =
      await getPublicProductBySlug(productSlug);

    console.log("\nConsulta administrativa:");

    console.dir(
      administrativeProduct
        ? {
            name: administrativeProduct.name,
            slug: administrativeProduct.slug,
            status: administrativeProduct.status,
            saleMode: administrativeProduct.saleMode,
          }
        : null,
      { depth: null },
    );

    console.log("\nConsulta pública:");

    console.dir(publicProduct, { depth: null });
  } finally {
    await getDatabaseClient().end();
  }
}

checkProductService().catch((error) => {
  console.error("No se pudo comprobar el servicio de productos");
  console.error(error);
  process.exit(1);
});