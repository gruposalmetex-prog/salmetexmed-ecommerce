import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { getDatabase, getDatabaseClient, } from "../src/db";

import { areaCategories, areas, brands, categories, productCategories, products, productVariants } from "../src/db/schema";

config({ path: ".env.local" });

const demoProductSlug = "monitor-signos-vitales-demo";
const purchasableProductSlug = "oximetro-pulso-demo";

async function seedCatalog() {
  if (process.env.DATABASE_BRANCH !== "development") {
    throw new Error(
      "El seed solamente puede ejecutarse en la rama development",
    );
  }

  const db = getDatabase();

  try {
    await db.transaction(async (transaction) => {
      const [existingArea] = await transaction
        .select({ id: areas.id })
        .from(areas)
        .where(eq(areas.slug, "cardiologia"))
        .limit(1);

      const areaId =
        existingArea?.id ??
        (
          await transaction
            .insert(areas)
            .values({
              name: "Cardiología",
              slug: "cardiologia",
              shortDescription:
                "Equipos para diagnóstico y monitoreo cardiovascular.",
              active: true,
              sortOrder: 1,
              seoTitle: "Equipo de cardiología",
              seoDescription:
                "Equipos médicos para diagnóstico, monitoreo y atención cardiovascular.",
            })
            .returning({ id: areas.id })
        )[0]!.id;

      const [existingCategory] = await transaction
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, "monitores-de-paciente"))
        .limit(1);

      const categoryId =
        existingCategory?.id ??
        (
          await transaction
            .insert(categories)
            .values({
              name: "Monitores de paciente",
              slug: "monitores-de-paciente",
              shortDescription:
                "Monitoreo continuo de signos vitales.",
              active: true,
              seoTitle: "Monitores de paciente",
              seoDescription:
                "Monitores de paciente para hospitales, clínicas y consultorios.",
            })
            .returning({ id: categories.id })
        )[0]!.id;

      await transaction
        .insert(areaCategories)
        .values({
          areaId,
          categoryId,
          sortOrder: 1,
        })
        .onConflictDoNothing();

      const [existingBrand] = await transaction
        .select({ id: brands.id })
        .from(brands)
        .where(eq(brands.slug, "marca-demo"))
        .limit(1);

      const brandId =
        existingBrand?.id ??
        (
          await transaction
            .insert(brands)
            .values({
              name: "Marca Demo",
              slug: "marca-demo",
              description:
                "Marca utilizada únicamente durante el desarrollo.",
              active: true,
            })
            .returning({ id: brands.id })
        )[0]!.id;

      const [existingProduct] = await transaction
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, demoProductSlug))
        .limit(1);
      const productId =
        existingProduct?.id ??
        (
          await transaction
            .insert(products)
            .values({
              brandId,
              name: "Monitor de signos vitales de prueba",
              slug: demoProductSlug,
              shortDescription:
                "Producto de prueba para validar el catálogo.",
              description:
                "Este producto existe únicamente en la rama de desarrollo para comprobar las relaciones del catálogo.",
              status: "published",
              saleMode: "quote_only",
              featured: false,
              seoTitle: "Monitor de signos vitales de prueba",
              seoDescription:
                "Producto temporal para validar el funcionamiento del ecommerce médico.",
            })
            .returning({ id: products.id })
        )[0]!.id;

      await transaction
        .update(products)
        .set({
          status: "published",
          publishedAt: new Date(),
        })
        .where(eq(products.id, productId));

      const [existingVariant] = await transaction
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(eq(productVariants.sku, "DEMO-MONITOR-001"))
        .limit(1);

      if (!existingVariant) {
        await transaction.insert(productVariants).values({
          productId,
          name: "Variante principal",
          sku: "DEMO-MONITOR-001",
          model: "DEMO-001",
          attributes: {
            tipo: "Producto de prueba",
          },
          priceInCents: null,
          purchaseEnabled: false,
          trackInventory: true,
          stock: 0,
          allowBackorder: false,
          active: true,
          isDefault: true,
          sortOrder: 1,
        });
      }

      const [existingPurchasableProduct] =
        await transaction
          .select({
            id: products.id,
            publishedAt: products.publishedAt,
          })
          .from(products)
          .where(
            eq(
              products.slug,
              purchasableProductSlug,
            ),
          )
          .limit(1);

      const purchasableProductId =
        existingPurchasableProduct?.id ??
        (
          await transaction
            .insert(products)
            .values({
              brandId,
              name: "Oxímetro de pulso de prueba",
              slug: purchasableProductSlug,
              shortDescription:
                "Oxímetro portátil para medir saturación de oxígeno y frecuencia cardiaca.",
              description:
                "Producto de desarrollo utilizado para comprobar precios, inventario y compra directa.",
              status: "published",
              saleMode: "direct_purchase",
              featured: true,
              publishedAt: new Date(),
              seoTitle:
                "Oxímetro de pulso de prueba",
              seoDescription:
                "Oxímetro portátil de desarrollo para validar el flujo de compra directa.",
            })
            .returning({
              id: products.id,
            })
        )[0]!.id;

      if (
        existingPurchasableProduct &&
        !existingPurchasableProduct.publishedAt
      ) {
        await transaction
          .update(products)
          .set({
            status: "published",
            publishedAt: new Date(),
          })
          .where(
            eq(products.id, purchasableProductId),
          );
      }

      await transaction
        .insert(productCategories)
        .values({
          productId: purchasableProductId,
          categoryId,
        })
        .onConflictDoNothing();

      const [existingPurchasableVariant] =
        await transaction
          .select({
            id: productVariants.id,
          })
          .from(productVariants)
          .where(
            eq(
              productVariants.sku,
              "DEMO-OXIMETER-001",
            ),
          )
          .limit(1);

      if (!existingPurchasableVariant) {
        await transaction
          .insert(productVariants)
          .values({
            productId: purchasableProductId,
            name: "Presentación estándar",
            sku: "DEMO-OXIMETER-001",
            model: "OX-DEMO-100",
            attributes: {
              color: "Azul",
              pantalla: "OLED",
            },
            priceInCents: 159900,
            compareAtPriceInCents: 189900,
            purchaseEnabled: true,
            trackInventory: true,
            stock: 8,
            allowBackorder: false,
            active: true,
            isDefault: true,
            sortOrder: 1,
          });
      }
    });

    const product = await db.query.products.findFirst({
      where: eq(products.slug, demoProductSlug),

      with: {
        brand: true,
        variants: true,

        categoryLinks: {
          with: {
            category: {
              with: {
                areaLinks: {
                  with: {
                    area: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log("Catálogo de prueba creado correctamente");
    console.dir(product, {
      depth: null,
      colors: true,
    });
  } finally {
    await getDatabaseClient().end();
  }
}

seedCatalog().catch((error) => {
  console.error("No se pudo crear el catálogo de prueba");
  console.error(error);
  process.exit(1);
});