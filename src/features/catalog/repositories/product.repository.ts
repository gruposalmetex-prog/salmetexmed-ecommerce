import { getDatabase } from "@/db";

import {
  and,
  eq,
  exists,
  inArray,
  sql,
  gt,
  or,
  gte,
  isNotNull,
  lte,
  type SQL,
  type SQLWrapper,
} from "drizzle-orm";

import {
  areaCategories,
  areas,
  brands,
  categories,
  productCategories,
  products as productsTable,
  productVariants,
} from "@/db/schema";

function containsText(
  column: SQLWrapper,
  pattern: string,
): SQL {
  return sql`
    unaccent(lower(${column}))
    LIKE unaccent(lower(${pattern}))
  `;
}

function queryProductBySlug(
  slug: string,
  publishedOnly: boolean,
) {
  const db = getDatabase();

  return db.query.products.findFirst({
    where: (products, { and, eq }) => {
      const slugCondition = eq(products.slug, slug);

      if (!publishedOnly) {
        return slugCondition;
      }

      return and(
        slugCondition,
        eq(products.status, "published"),
      );
    },

    with: {
      brand: true,

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

      variants: {
        orderBy: (variants, { asc }) => [
          asc(variants.sortOrder),
        ],
      },

      images: {
        orderBy: (images, { desc, asc }) => [
          desc(images.isPrimary),
          asc(images.sortOrder),
        ],
      },

      documents: true,
    },
  });


}

export type ProductSaleMode =
  | "direct_purchase"
  | "quote_only"
  | "contact_only";

export interface ProductListFilters {
  ids?: string[];
  search?: string;
  featured?: boolean;
  promotion?: boolean;
  saleModes?: ProductSaleMode[];
  areas?: string[];
  categories?: string[];
  brands?: string[];
  inStock?: boolean;
  minPriceInCents?: number;
  maxPriceInCents?: number;
}

export async function listPublishedProducts(filters: ProductListFilters = {}, limit?: number) {
  const db = getDatabase();

  const conditions: SQL[] = [
    eq(productsTable.status, "published"),
  ];

  if (filters.ids?.length) {
    conditions.push(
      inArray(
        productsTable.id,
        filters.ids,
      ),
    );
  }

  if (filters.featured !== undefined) {
    conditions.push(
      eq(
        productsTable.featured,
        filters.featured,
      ),
    );
  }

  const searchTerm =
    filters.search?.trim();

  if (searchTerm) {
    const searchPattern =
      `%${searchTerm}%`;

    const searchCondition = or(
      containsText(
        productsTable.name,
        searchPattern,
      ),

      containsText(
        productsTable.slug,
        searchPattern,
      ),

      containsText(
        productsTable.shortDescription,
        searchPattern,
      ),

      containsText(
        productsTable.description,
        searchPattern,
      ),

      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(brands)
          .where(
            and(
              eq(
                brands.id,
                productsTable.brandId,
              ),
              eq(brands.active, true),
              or(
                containsText(
                  brands.name,
                  searchPattern,
                ),
                containsText(
                  brands.slug,
                  searchPattern,
                ),
              ),
            ),
          ),
      ),

      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productCategories)
          .innerJoin(
            categories,
            eq(
              categories.id,
              productCategories.categoryId,
            ),
          )
          .where(
            and(
              eq(
                productCategories.productId,
                productsTable.id,
              ),
              eq(
                categories.active,
                true,
              ),
              or(
                containsText(
                  categories.name,
                  searchPattern,
                ),
                containsText(
                  categories.slug,
                  searchPattern,
                ),
              ),
            ),
          ),
      ),

      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productVariants)
          .where(
            and(
              eq(
                productVariants.productId,
                productsTable.id,
              ),
              eq(
                productVariants.active,
                true,
              ),
              or(
                containsText(
                  productVariants.name,
                  searchPattern,
                ),
                containsText(
                  productVariants.sku,
                  searchPattern,
                ),
                containsText(
                  productVariants.model,
                  searchPattern,
                ),
              ),
            ),
          ),
      ),
    );

    if (searchCondition) {
      conditions.push(
        searchCondition,
      );
    }
  }

  if (filters.saleModes?.length) {
    conditions.push(
      inArray(
        productsTable.saleMode,
        filters.saleModes,
      ),
    );
  }

  if (filters.promotion) {
    conditions.push(
      eq(
        productsTable.saleMode,
        "direct_purchase",
      ),

      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productVariants)
          .where(
            and(
              eq(
                productVariants.productId,
                productsTable.id,
              ),
              eq(
                productVariants.active,
                true,
              ),
              eq(
                productVariants.purchaseEnabled,
                true,
              ),
              isNotNull(
                productVariants.priceInCents,
              ),
              isNotNull(
                productVariants.compareAtPriceInCents,
              ),
              gt(
                productVariants.compareAtPriceInCents,
                productVariants.priceInCents,
              ),
              or(
                eq(
                  productVariants.trackInventory,
                  false,
                ),
                gt(
                  productVariants.stock,
                  0,
                ),
                eq(
                  productVariants.allowBackorder,
                  true,
                ),
              ),
            ),
          ),
      ),
    );
  }

  if (filters.brands?.length) {
    conditions.push(
      inArray(
        productsTable.brandId,
        db
          .select({
            id: brands.id,
          })
          .from(brands)
          .where(
            and(
              eq(brands.active, true),
              inArray(brands.slug, filters.brands),
            ),
          ),
      ),
    );
  }

  if (filters.categories?.length) {
    conditions.push(
      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productCategories)
          .innerJoin(
            categories,
            eq(
              categories.id,
              productCategories.categoryId,
            ),
          )
          .where(
            and(
              eq(
                productCategories.productId,
                productsTable.id,
              ),
              eq(categories.active, true),
              inArray(
                categories.slug,
                filters.categories,
              ),
            ),
          ),
      ),
    );
  }

  if (filters.areas?.length) {
    conditions.push(
      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productCategories)
          .innerJoin(
            categories,
            eq(
              categories.id,
              productCategories.categoryId,
            ),
          )
          .innerJoin(
            areaCategories,
            eq(
              areaCategories.categoryId,
              categories.id,
            ),
          )
          .innerJoin(
            areas,
            eq(areas.id, areaCategories.areaId),
          )
          .where(
            and(
              eq(
                productCategories.productId,
                productsTable.id,
              ),
              eq(categories.active, true),
              eq(areas.active, true),
              inArray(areas.slug, filters.areas),
            ),
          ),
      ),
    );
  }

  if (filters.inStock) {
    conditions.push(
      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productVariants)
          .where(
            and(
              eq(
                productVariants.productId,
                productsTable.id,
              ),
              eq(productVariants.active, true),
              or(
                eq(
                  productVariants.trackInventory,
                  false,
                ),
                gt(productVariants.stock, 0),
              ),
            ),
          ),
      ),
    );
  }

  const hasPriceFilter =
    filters.minPriceInCents !== undefined ||
    filters.maxPriceInCents !== undefined;

  if (hasPriceFilter) {
    const priceConditions: SQL[] = [
      eq(
        productVariants.productId,
        productsTable.id,
      ),
      eq(productVariants.active, true),
      eq(productVariants.purchaseEnabled, true),
      isNotNull(productVariants.priceInCents),
      or(
        eq(productVariants.trackInventory, false),
        gt(productVariants.stock, 0),
        eq(productVariants.allowBackorder, true),
      )!,
    ];

    if (filters.minPriceInCents !== undefined) {
      priceConditions.push(
        gte(
          productVariants.priceInCents,
          filters.minPriceInCents,
        ),
      );
    }

    if (filters.maxPriceInCents !== undefined) {
      priceConditions.push(
        lte(
          productVariants.priceInCents,
          filters.maxPriceInCents,
        ),
      );
    }

    conditions.push(
      eq(
        productsTable.saleMode,
        "direct_purchase",
      ),

      exists(
        db
          .select({
            value: sql`1`,
          })
          .from(productVariants)
          .where(and(...priceConditions)),
      ),
    );
  }

  return db.query.products.findMany({
    where: and(...conditions),

    ...(limit !== undefined ? {
      limit,
    } : {}),

    columns: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      saleMode: true,
      featured: true,
      publishedAt: true,
    },

    with: {
      brand: {
        columns: {
          name: true,
          slug: true,
          active: true,
        },
      },

      variants: {
        where: (variants, { eq }) =>
          eq(variants.active, true),

        columns: {
          id: true,
          name: true,
          priceInCents: true,
          compareAtPriceInCents: true,
          purchaseEnabled: true,
          trackInventory: true,
          stock: true,
          allowBackorder: true,
          isDefault: true,
          sortOrder: true,
        },

        orderBy: (variants, { desc, asc }) => [
          desc(variants.isDefault),
          asc(variants.sortOrder),
        ],
      },

      images: {
        columns: {
          url: true,
          altText: true,
          width: true,
          height: true,
          format: true,
          isPrimary: true,
        },

        orderBy: (images, { desc, asc }) => [
          desc(images.isPrimary),
          asc(images.sortOrder),
        ],

        limit: 1,
      },
    },

    orderBy: (products, { desc, asc }) => [
      desc(products.featured),
      desc(products.publishedAt),
      asc(products.name),
    ],
  });
}

export type ProductListRecord = Awaited<
  ReturnType<typeof listPublishedProducts>
>[number];

export function findProductBySlug(slug: string) {
  return queryProductBySlug(slug, false);
}

export function findPublishedProductBySlug(slug: string) {
  return queryProductBySlug(slug, true);
}

export type ProductDetailRecord = NonNullable<
  Awaited<ReturnType<typeof queryProductBySlug>>
>;