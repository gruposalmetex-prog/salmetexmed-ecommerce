import "server-only";

import {
    asc,
    eq,
    and,
    inArray,
    sql,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
    areaCategories,
    areas as areasTable,
    categories as categoriesTable,
} from "@/db/schema";

import type {
    CreateAdminCategoryInput,
    UpdateAdminCategoryInput,
} from "../schemas/admin-category.schema";

export async function listAdminCategories() {
    const db = getDatabase();

    return db
        .select({
            id: categoriesTable.id,
            name: categoriesTable.name,
            slug: categoriesTable.slug,
            shortDescription:
                categoriesTable.shortDescription,
            active: categoriesTable.active,
            createdAt: categoriesTable.createdAt,
            updatedAt: categoriesTable.updatedAt,

            areaCount: sql<number>`
        (
          select count(*)::int
          from ${areaCategories}
          where ${areaCategories.categoryId}
            = ${categoriesTable.id}
        )
      `,
        })
        .from(categoriesTable)
        .orderBy(asc(categoriesTable.name));
}

export async function listAdminCategoryFormOptions() {
    const db = getDatabase();

    const areaRecords = await db
        .select({
            id: areasTable.id,
            name: areasTable.name,
            slug: areasTable.slug,
        })
        .from(areasTable)
        .where(eq(areasTable.active, true))
        .orderBy(
            asc(areasTable.sortOrder),
            asc(areasTable.name),
        );

    return {
        areas: areaRecords,
    };
}

export async function findAdminCategoryBySlug(
    slug: string,
) {
    const db = getDatabase();

    const [category] = await db
        .select({
            id: categoriesTable.id,
            slug: categoriesTable.slug,
        })
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, slug))
        .limit(1);

    return category ?? null;
}

export async function findActiveAdminAreaIds(
    areaIds: string[],
) {
    if (areaIds.length === 0) {
        return [];
    }

    const db = getDatabase();

    return db
        .select({
            id: areasTable.id,
        })
        .from(areasTable)
        .where(
            and(
                inArray(
                    areasTable.id,
                    areaIds,
                ),
                eq(areasTable.active, true),
            ),
        );
}

export async function createAdminCategory(
    input: CreateAdminCategoryInput,
) {
    const db = getDatabase();

    return db.transaction(async (transaction) => {
        const [category] = await transaction
            .insert(categoriesTable)
            .values({
                name: input.name,
                slug: input.slug,

                shortDescription:
                    input.shortDescription ?? null,

                description:
                    input.description ?? null,

                active: input.active,

                seoTitle:
                    input.seoTitle ?? null,

                seoDescription:
                    input.seoDescription ?? null,
            })
            .returning({
                id: categoriesTable.id,
                name: categoriesTable.name,
                slug: categoriesTable.slug,
                active: categoriesTable.active,
            });

        if (!category) {
            return null;
        }

        if (input.areaIds.length > 0) {
            await transaction
                .insert(areaCategories)
                .values(
                    input.areaIds.map(
                        (areaId, index) => ({
                            areaId,
                            categoryId: category.id,
                            sortOrder: index,
                        }),
                    ),
                );
        }

        return category;
    });
}

export async function findAdminCategoryById(
    categoryId: string,
) {
    const db = getDatabase();

    const [
        categoryRecords,
        areaRecords,
    ] = await Promise.all([
        db
            .select({
                id: categoriesTable.id,
                name: categoriesTable.name,
                slug: categoriesTable.slug,

                shortDescription:
                    categoriesTable.shortDescription,

                description:
                    categoriesTable.description,

                imageUrl:
                    categoriesTable.imageUrl,

                imagePublicId:
                    categoriesTable.imagePublicId,

                active:
                    categoriesTable.active,

                seoTitle:
                    categoriesTable.seoTitle,

                seoDescription:
                    categoriesTable.seoDescription,

                createdAt:
                    categoriesTable.createdAt,

                updatedAt:
                    categoriesTable.updatedAt,
            })
            .from(categoriesTable)
            .where(
                eq(
                    categoriesTable.id,
                    categoryId,
                ),
            )
            .limit(1),

        db
            .select({
                areaId:
                    areaCategories.areaId,

                sortOrder:
                    areaCategories.sortOrder,
            })
            .from(areaCategories)
            .where(
                eq(
                    areaCategories.categoryId,
                    categoryId,
                ),
            )
            .orderBy(
                asc(areaCategories.sortOrder),
            ),
    ]);

    const category =
        categoryRecords[0];

    if (!category) {
        return null;
    }

    return {
        ...category,

        areaIds:
            areaRecords.map(
                (record) => record.areaId,
            ),
    };
}

export async function updateAdminCategory(
    input: UpdateAdminCategoryInput,
) {
    const db = getDatabase();

    return db.transaction(
        async (transaction) => {
            const [category] =
                await transaction
                    .update(categoriesTable)
                    .set({
                        name: input.name,
                        slug: input.slug,

                        shortDescription:
                            input.shortDescription ?? null,

                        description:
                            input.description ?? null,

                        active: input.active,

                        seoTitle:
                            input.seoTitle ?? null,

                        seoDescription:
                            input.seoDescription ?? null,

                        updatedAt: new Date(),
                    })
                    .where(
                        eq(
                            categoriesTable.id,
                            input.id,
                        ),
                    )
                    .returning({
                        id: categoriesTable.id,
                        name: categoriesTable.name,
                        slug: categoriesTable.slug,
                        active: categoriesTable.active,
                    });

            if (!category) {
                return null;
            }

            await transaction
                .delete(areaCategories)
                .where(
                    eq(
                        areaCategories.categoryId,
                        category.id,
                    ),
                );

            if (input.areaIds.length > 0) {
                await transaction
                    .insert(areaCategories)
                    .values(
                        input.areaIds.map(
                            (areaId, index) => ({
                                areaId,
                                categoryId:
                                    category.id,
                                sortOrder: index,
                            }),
                        ),
                    );
            }

            return {
                ...category,
                areaIds: input.areaIds,
            };
        },
    );
}

export async function listAdminCategoryEditFormOptions() {
    const db = getDatabase();

    const areaRecords = await db
      .select({
        id: areasTable.id,
        name: areasTable.name,
        slug: areasTable.slug,
        active: areasTable.active,
      })
      .from(areasTable)
      .orderBy(
        asc(areasTable.sortOrder),
        asc(areasTable.name),
      );

    return {
      areas: areaRecords,
    };
  }

  export async function findExistingAdminAreaIds(
    areaIds: string[],
  ) {
    if (areaIds.length === 0) {
      return [];
    }

    const db = getDatabase();

    return db
      .select({
        id: areasTable.id,
      })
      .from(areasTable)
      .where(
        inArray(
          areasTable.id,
          areaIds,
        ),
      );
  }