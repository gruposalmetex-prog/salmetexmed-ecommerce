import { config } from "dotenv";

config({
  path: ".env.local",
});

async function main() {
  const {
    getAdminProducts,
    getAdminDashboardSummary,
  } = await import(
    "../src/features/admin/products/services/admin-product.service"
  );

  const summary =
    await getAdminDashboardSummary();

  const list =
    await getAdminProducts({
      page: 1,
      pageSize: 20,
    });

  console.log("\nResumen administrativo:");

  console.table({
    productos: summary.totalProducts,
    publicados:
      summary.publishedProducts,
    borradores:
      summary.draftProducts,
    archivados:
      summary.archivedProducts,
    variantes:
      summary.variantCount,
  });

  console.log("\nProductos:");

  console.table(
    list.products.map(
      (product) => ({
        name: product.name,
        status: product.status,
        brand:
          product.brand?.name ??
          "Sin marca",
        variants:
          product.variantCount,
        activeVariants:
          product.activeVariantCount,
        stock:
          product.inventory.stock,
      }),
    ),
  );

  console.log("\nPaginación:");

  console.table({
    page:
      list.pagination.page,
    pageSize:
      list.pagination.pageSize,
    totalItems:
      list.pagination.totalItems,
    totalPages:
      list.pagination.totalPages,
  });
}

main().catch((error) => {
  console.error(
    "No fue posible comprobar los productos administrativos:",
  );

  console.error(error);

  process.exitCode = 1;
});