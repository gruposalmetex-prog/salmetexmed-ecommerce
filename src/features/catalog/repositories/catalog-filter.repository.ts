import {
  and,
  asc,
  eq,
  sql,
  exists,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
  areaCategories,
  areas,
  brands,
  categories,
  productCategories,
  products,
} from "@/db/schema";

export async function listCatalogFilterOptions() {
  const db = getDatabase();

  const [areaOptions, categoryOptions, brandOptions] =
    await Promise.all([
      db
        .select({
          name: areas.name,
          slug: areas.slug,
          description:
            areas.shortDescription,
          image: areas.imageUrl,

          count: sql<number>`
            count(distinct ${products.id})::int
          `,
        })
        .from(areas)
        .leftJoin(
          areaCategories,
          eq(areaCategories.areaId, areas.id),
        )
        .leftJoin(
          categories,
          and(
            eq(
              categories.id,
              areaCategories.categoryId,
            ),
            eq(categories.active, true),
          ),
        )
        .leftJoin(
          productCategories,
          eq(
            productCategories.categoryId,
            categories.id,
          ),
        )
        .leftJoin(
          products,
          and(
            eq(
              products.id,
              productCategories.productId,
            ),
            eq(products.status, "published"),
          ),
        )
        .where(eq(areas.active, true))
        .groupBy(
          areas.id,
          areas.name,
          areas.slug,
          areas.shortDescription,
          areas.imageUrl,
        )
        .having(
          sql`count(distinct ${products.id}) > 0`,
        )
        .orderBy(asc(areas.name)),

      db
        .select({
          name: categories.name,
          slug: categories.slug,
          description:
            categories.shortDescription,
          image: categories.imageUrl,

          count: sql<number>`
          count(distinct ${products.id})::int
        `,
        })
        .from(categories)
        .leftJoin(
          productCategories,
          eq(
            productCategories.categoryId,
            categories.id,
          ),
        )
        .leftJoin(
          products,
          and(
            eq(
              products.id,
              productCategories.productId,
            ),
            eq(products.status, "published"),
          ),
        )
        .where(eq(categories.active, true))
        .groupBy(
          categories.id,
          categories.name,
          categories.slug,
          categories.shortDescription,
          categories.imageUrl,
        )
        .having(
          sql`count(distinct ${products.id}) > 0`,
        )
        .orderBy(asc(categories.name)),

      db
        .select({
          name: brands.name,
          slug: brands.slug,
          count: sql<number>`
              count(distinct ${products.id})::int
            `,
        })
        .from(brands)
        .leftJoin(
          products,
          and(
            eq(products.brandId, brands.id),
            eq(products.status, "published"),
          ),
        )
        .where(eq(brands.active, true))
        .groupBy(brands.id, brands.name, brands.slug)
        .having(
          sql`count(distinct ${products.id}) > 0`,
        )
        .orderBy(asc(brands.name)),
    ]);

  return {
    areas: areaOptions,
    categories: categoryOptions,
    brands: brandOptions,
  };
}

export async function findPublicCategoryMetadataBySlug(
  slug: string,
) {
  const db = getDatabase();

  const [category] =
    await db
      .select({
        name:
          categories.name,

        slug:
          categories.slug,

        shortDescription:
          categories.shortDescription,

        description:
          categories.description,

        seoTitle:
          categories.seoTitle,

        seoDescription:
          categories.seoDescription,
      })
      .from(categories)
      .where(
        and(
          eq(
            categories.slug,
            slug,
          ),

          eq(
            categories.active,
            true,
          ),

          exists(
            db
              .select({
                id: products.id,
              })
              .from(
                productCategories,
              )
              .innerJoin(
                products,
                eq(
                  products.id,
                  productCategories.productId,
                ),
              )
              .where(
                and(
                  eq(
                    productCategories.categoryId,
                    categories.id,
                  ),

                  eq(
                    products.status,
                    "published",
                  ),
                ),
              ),
          ),
        ),
      )
      .limit(1);

  return category ?? null;
}

export async function findPublicAreaMetadataBySlug(
  slug: string,
) {
  const db = getDatabase();

  const [area] = await db
    .select({
      name: areas.name,
      slug: areas.slug,
      shortDescription:
        areas.shortDescription,
      description:
        areas.description,
      seoTitle:
        areas.seoTitle,
      seoDescription:
        areas.seoDescription,
    })
    .from(areas)
    .where(
      and(
        eq(areas.slug, slug),
        eq(areas.active, true),

        exists(
          db
            .select({
              id: products.id,
            })
            .from(areaCategories)
            .innerJoin(
              categories,
              eq(
                categories.id,
                areaCategories.categoryId,
              ),
            )
            .innerJoin(
              productCategories,
              eq(
                productCategories.categoryId,
                categories.id,
              ),
            )
            .innerJoin(
              products,
              eq(
                products.id,
                productCategories.productId,
              ),
            )
            .where(
              and(
                eq(
                  areaCategories.areaId,
                  areas.id,
                ),
                eq(
                  categories.active,
                  true,
                ),
                eq(
                  products.status,
                  "published",
                ),
              ),
            ),
        ),
      ),
    )
    .limit(1);

  return area ?? null;
}