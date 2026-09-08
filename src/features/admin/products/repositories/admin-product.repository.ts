import "server-only";

import {
    and,
    asc,
    eq,
    exists,
    or,
    sql,
    type SQL,
    type SQLWrapper,
} from "drizzle-orm";

import type {
    CreateAdminProductInput,
    UpdateAdminProductInput
} from "../schemas/admin-product.schema";

import { getDatabase } from "@/db";
import {
    brands,
    categories,
    productCategories,
    productVariants,
    products as productsTable,
} from "@/db/schema";
import { CreateAdminProductVariantInput } from "../schemas/admin-product-variant.schema";

export type AdminProductStatus =
    | "draft"
    | "published"
    | "archived";

export interface AdminProductListFilters {
    search?: string;
    status?: AdminProductStatus;
    page: number;
    pageSize: number;
}

function containsText(
    column: SQLWrapper,
    pattern: string,
): SQL {
    return sql`
    unaccent(lower(${column}))
    LIKE unaccent(lower(${pattern}))
  `;
}

function createAdminProductConditions(
    filters: AdminProductListFilters,
) {
    const db = getDatabase();
    const conditions: SQL[] = [];

    if (filters.status) {
        conditions.push(
            eq(
                productsTable.status,
                filters.status,
            ),
        );
    }

    const searchTerm =
        filters.search?.trim();

    if (searchTerm) {
        const pattern = `%${searchTerm}%`;

        const searchCondition = or(
            containsText(
                productsTable.name,
                pattern,
            ),

            containsText(
                productsTable.slug,
                pattern,
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

                            or(
                                containsText(
                                    brands.name,
                                    pattern,
                                ),
                                containsText(
                                    brands.slug,
                                    pattern,
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

                            or(
                                containsText(
                                    productVariants.name,
                                    pattern,
                                ),
                                containsText(
                                    productVariants.sku,
                                    pattern,
                                ),
                                containsText(
                                    productVariants.model,
                                    pattern,
                                ),
                            ),
                        ),
                    ),
            ),
        );

        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    return conditions.length
        ? and(...conditions)
        : undefined;
}

export async function listAdminProducts(
    filters: AdminProductListFilters,
) {
    const db = getDatabase();

    const whereCondition =
        createAdminProductConditions(filters);

    const offset =
        (filters.page - 1) *
        filters.pageSize;

    const [records, totalRows] =
        await Promise.all([
            db.query.products.findMany({
                where: whereCondition,

                columns: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                    saleMode: true,
                    featured: true,
                    publishedAt: true,
                    createdAt: true,
                    updatedAt: true,
                },

                with: {
                    brand: {
                        columns: {
                            name: true,
                            slug: true,
                        },
                    },

                    variants: {
                        columns: {
                            id: true,
                            active: true,
                            stock: true,
                            trackInventory: true,
                            allowBackorder: true,
                            purchaseEnabled: true,
                        },
                    },

                    images: {
                        columns: {
                            url: true,
                            altText: true,
                            width: true,
                            height: true,
                            isPrimary: true,
                            sortOrder: true,
                        },

                        orderBy: (
                            images,
                            { desc, asc },
                        ) => [
                                desc(images.isPrimary),
                                asc(images.sortOrder),
                            ],

                        limit: 1,
                    },
                },

                orderBy: (
                    products,
                    { desc, asc },
                ) => [
                        desc(products.updatedAt),
                        asc(products.name),
                    ],

                limit: filters.pageSize,
                offset,
            }),

            db
                .select({
                    total: sql<number>`
            count(*)::int
          `,
                })
                .from(productsTable)
                .where(whereCondition),
        ]);

    return {
        records,
        total:
            Number(totalRows[0]?.total) || 0,
    };
}

export async function getAdminProductCounts() {
    const db = getDatabase();

    const [
        statusRows,
        variantRows,
    ] = await Promise.all([
        db
            .select({
                status: productsTable.status,

                count: sql<number>`
          count(*)::int
        `,
            })
            .from(productsTable)
            .groupBy(productsTable.status),

        db
            .select({
                count: sql<number>`
          count(*)::int
        `,
            })
            .from(productVariants),
    ]);

    return {
        statusRows,
        variantCount:
            Number(variantRows[0]?.count) || 0,
    };
}

export async function listAdminProductFormOptions() {
    const db = getDatabase();

    const [
        brandRecords,
        categoryRecords,
    ] = await Promise.all([
        db
            .select({
                id: brands.id,
                name: brands.name,
                slug: brands.slug,
            })
            .from(brands)
            .where(
                eq(brands.active, true),
            )
            .orderBy(asc(brands.name)),

        db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
            })
            .from(categories)
            .where(
                eq(categories.active, true),
            )
            .orderBy(asc(categories.name)),
    ]);

    return {
        brands: brandRecords,
        categories: categoryRecords,
    };
}

export async function createAdminProduct(
    input: CreateAdminProductInput,
) {
    const db = getDatabase();

    return db.transaction(
        async (transaction) => {
            const [product] =
                await transaction
                    .insert(productsTable)
                    .values({
                        name: input.name,
                        slug: input.slug,

                        brandId:
                            input.brandId,

                        shortDescription:
                            input.shortDescription,

                        description:
                            input.description,

                        saleMode:
                            input.saleMode,

                        featured:
                            input.featured,

                        seoTitle:
                            input.seoTitle ?? null,

                        seoDescription:
                            input.seoDescription ??
                            null,

                        status: "draft",
                        publishedAt: null,
                        canonicalUrl: null,
                    })
                    .returning({
                        id: productsTable.id,
                        slug:
                            productsTable.slug,
                    });

            if (!product) {
                throw new Error(
                    "No fue posible crear el producto.",
                );
            }

            await transaction
                .insert(productCategories)
                .values(
                    input.categoryIds.map(
                        (categoryId) => ({
                            productId:
                                product.id,

                            categoryId,
                        }),
                    ),
                );

            return product;
        },
    );
}

export async function updateAdminProductRecord(
    input: UpdateAdminProductInput,
) {
    const db = getDatabase();

    return db.transaction(
        async (transaction) => {
            const [product] =
                await transaction
                    .update(productsTable)
                    .set({
                        name: input.name,
                        slug: input.slug,
                        brandId: input.brandId,

                        shortDescription:
                            input.shortDescription,

                        description:
                            input.description,

                        saleMode:
                            input.saleMode,

                        featured:
                            input.featured,

                        seoTitle:
                            input.seoTitle ?? null,

                        seoDescription:
                            input.seoDescription ??
                            null,
                    })
                    .where(
                        eq(
                            productsTable.id,
                            input.productId,
                        ),
                    )
                    .returning({
                        id: productsTable.id,
                        slug: productsTable.slug,
                        status:
                            productsTable.status,
                    });

            if (!product) {
                return null;
            }

            await transaction
                .delete(productCategories)
                .where(
                    eq(
                        productCategories.productId,
                        product.id,
                    ),
                );

            await transaction
                .insert(productCategories)
                .values(
                    input.categoryIds.map(
                        (categoryId) => ({
                            productId: product.id,
                            categoryId,
                        }),
                    ),
                );

            return product;
        },
    );
}

export async function findAdminProductById(
    productId: string,
) {
    const db = getDatabase();

    return db.query.products.findFirst({
        where: eq(
            productsTable.id,
            productId,
        ),
        columns: {
            id: true,
            name: true,
            slug: true,
            status: true,
            saleMode: true,
            featured: true,
            shortDescription: true,
            description: true,
            seoTitle: true,
            seoDescription: true,
            canonicalUrl: true,
            brandId: true,
            createdAt: true,
            updatedAt: true,
        },
        with: {
            brand: {
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },

            categoryLinks: {
                columns: {
                    categoryId: true,
                },
                with: {
                    category: {
                        columns: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },

            variants: {
                columns: {
                    id: true,
                    name: true,
                    sku: true,
                    active: true,
                    stock: true,
                    priceInCents: true,
                    purchaseEnabled: true,
                    isDefault: true,
                },
            },

            images: {
                columns: {
                    id: true,
                    url: true,
                    altText: true,
                    isPrimary: true,
                    sortOrder: true,
                },
            },

            documents: {
                columns: {
                    id: true,
                    title: true,
                    fileName: true,
                    url: true,
                    documentType: true,
                },
            },
        },
    });
}

export async function findAdminProductVariantContext(productId: string) {
    const db = getDatabase();

    const [product] = await db
        .select({
            id: productsTable.id,
            status: productsTable.status,
            saleMode: productsTable.saleMode,
        })
        .from(productsTable)
        .where(
            eq(
                productsTable.id,
                productId,
            ),
        )
        .limit(1);

    return product ?? null
}

export async function insertAdminProductVariant(
    input: CreateAdminProductVariantInput) {
    const db = getDatabase();

    return db.transaction(async (transaction) => {
        const [variantSummary] = await transaction
            .select({
                count: sql<number>`
                count(*)::int
                `,
                nextSortOrder: sql<number>`
                (
                    coalesce (
                        max(${productVariants.sortOrder}),
                        -1
                    ) + 1
                ):: int
                `,
            })
            .from(productVariants)
            .where(
                eq(
                    productVariants.productId,
                    input.productId,
                )
            );
        const variantCount = Number(variantSummary?.count ?? 0);

        const nextSortOrder = Number(variantSummary?.nextSortOrder ?? 0);

        const isFirstVariant = variantCount === 0;

        const shouldBeDefault = isFirstVariant || input.isDefault;

        if (shouldBeDefault && !isFirstVariant) {
            await transaction
                .update(productVariants)
                .set({
                    isDefault: false,
                })
                .where(
                    and(
                        eq(
                            productVariants.productId,
                            input.productId,
                        )
                        ,
                        eq(
                            productVariants.isDefault,
                            true,
                        ),
                    ),
                );
        }

        const [variant] = await transaction
            .insert(productVariants)
            .values({
                productId: input.productId,
                name: input.name,
                sku: input.sku,
                barcode: input.barcode,
                model: input.model,
                attributes: {},
                priceInCents: input.priceInCents,
                compareAtPriceInCents: input.compareAtPriceInCents,
                purchaseEnabled: input.purchaseEnabled,
                trackInventory: input.trackInventory,
                stock: input.stock,
                allowBackorder: input.allowBackorder,
                active: input.active,
                isDefault: shouldBeDefault,
                sortOrder: nextSortOrder,
            })

            .returning({
                id: productVariants.id,
                productId: productVariants.productId,
                name: productVariants.name,
                sku: productVariants.sku,
                isDefault: productVariants.isDefault,
            });

        if (!variant) {
            throw new Error(
                "No fue posible crear la variante."
            )
        }
        return variant;
    })
}

export async function markAdminProductAsPublished(productId: string) {
    const db = getDatabase();

    const [product] = await db
        .update(productsTable)
        .set({
            status: "published",
            publishedAt: new Date(),
        })
        .where(
            eq(
                productsTable.id,
                productId,
            )
        )
        .returning({
            id: productsTable.id,
            slug: productsTable.slug,
            status: productsTable.status,
            publishedAt:
                productsTable.publishedAt,
        });
    return product ?? null;
}

export async function markPublishedAdminProductAsDraft(productId: string) {
    const db = getDatabase();

    const [product] = await db
        .update(productsTable)
        .set({
            status: "draft",
            publishedAt: null
        })
        .where(
            and(
                eq(
                    productsTable.id,
                    productId,
                ),
                eq(
                    productsTable.status,
                    "published"
                ),
            ),
        )
        .returning({
            id: productsTable.id,
            slug: productsTable.slug,
            status: productsTable.status,
            publishedAt: productsTable.publishedAt
        })
    return product ?? null
}

export type AdminProductListRecord = Awaited<ReturnType<typeof listAdminProducts>>["records"][number];