import "server-only";

import {
  and,
  eq,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
  categories as categoriesTable,
} from "@/db/schema";

export async function findAdminCategoryImageContext(
  categoryId: string,
) {
  const db = getDatabase();

  const [category] = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      active: categoriesTable.active,

      imageUrl:
        categoriesTable.imageUrl,

      imagePublicId:
        categoriesTable.imagePublicId,
    })
    .from(categoriesTable)
    .where(
      eq(
        categoriesTable.id,
        categoryId,
      ),
    )
    .limit(1);

  return category ?? null;
}

interface SaveAdminCategoryImageInput {
  categoryId: string;
  url: string;
  publicId: string;
}

export async function saveAdminCategoryImage(
  input: SaveAdminCategoryImageInput,
) {
  const db = getDatabase();

  const [category] = await db
    .update(categoriesTable)
    .set({
      imageUrl: input.url,

      imagePublicId:
        input.publicId,

      updatedAt: new Date(),
    })
    .where(
      eq(
        categoriesTable.id,
        input.categoryId,
      ),
    )
    .returning({
      id: categoriesTable.id,
      name: categoriesTable.name,
      imageUrl: categoriesTable.imageUrl,
      imagePublicId:
        categoriesTable.imagePublicId,
    });

  return category ?? null;
}

export async function clearAdminCategoryImage(
  categoryId: string,
  publicId: string,
) {
  const db = getDatabase();

  const [category] = await db
    .update(categoriesTable)
    .set({
      imageUrl: null,
      imagePublicId: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(
          categoriesTable.id,
          categoryId,
        ),
        eq(
          categoriesTable.imagePublicId,
          publicId,
        ),
      ),
    )
    .returning({
      id: categoriesTable.id,
    });

  return category ?? null;
}