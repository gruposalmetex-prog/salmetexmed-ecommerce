import { productSchema } from "../src/features/catalog/schemas/product.schema";
import { productVariantSchema } from "../src/features/catalog/schemas/product-variant.schema";

const productResult = productSchema.safeParse({
  brandId: "",
  name: "  Monitor de signos vitales  ",
  slug: "MONITOR-DE-SIGNOS-VITALES",
  shortDescription: "Monitor médico para consultorios y hospitales.",
  description:
    "Equipo para la medición y vigilancia de los principales signos vitales del paciente.",
  status: "draft",
  saleMode: "quote_only",
  featured: false,
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
});

const variantResult = productVariantSchema.safeParse({
  name: "Versión estándar",
  sku: "  monitor-001  ",
  barcode: "",
  model: "MX-200",
  attributes: {
    pantalla: "12 pulgadas",
    color: "Blanco",
  },
  priceInCents: "",
  compareAtPriceInCents: "",
  purchaseEnabled: false,
  trackInventory: true,
  stock: "5",
  allowBackorder: false,
  active: true,
  isDefault: true,
  sortOrder: "0",
});

console.log("Producto:");

if (productResult.success) {
  console.dir(productResult.data, { depth: null });
} else {
  console.dir(productResult.error.flatten(), { depth: null });
}

console.log("\nVariante:");

if (variantResult.success) {
  console.dir(variantResult.data, { depth: null });
} else {
  console.dir(variantResult.error.flatten(), { depth: null });
}