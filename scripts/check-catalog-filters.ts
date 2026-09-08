import { config } from "dotenv";

import { getDatabaseClient } from "../src/db";
import { getPublicCatalogFilters } from "../src/features/catalog/services/catalog-filter.service";

config({ path: ".env.local" });

async function checkCatalogFilters() {
  try {
    const filters =
      await getPublicCatalogFilters();

    console.log("\nÁreas:");
    console.table(filters.areas);

    console.log("\nCategorías:");
    console.table(filters.categories);

    console.log("\nMarcas:");
    console.table(filters.brands);
  } finally {
    await getDatabaseClient().end();
  }
}

checkCatalogFilters().catch((error) => {
  console.error(
    "No se pudieron consultar los filtros del catálogo",
  );

  console.error(error);
  process.exit(1);
});