import { config } from "dotenv";

import { getDatabaseClient } from "../src/db";
import { getPublicProducts } from "../src/features/catalog/services/product.service";

config({ path: ".env.local" });

async function checkProductList() {
  try {
    const products = await getPublicProducts();

    console.log(`\nProductos públicos encontrados: ${products.length}`);

    console.dir(products, {
      depth: null,
    });
  } finally {
    await getDatabaseClient().end();
  }
}

checkProductList().catch((error) => {
  console.error("No se pudo consultar el catálogo público");
  console.error(error);
  process.exit(1);
});