import "server-only";

import {
  asc,
  eq,
  sql,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
  areaCategories,
  areas as areasTable,
} from "@/db/schema";

import type {
  CreateAdminAreaInput,
  UpdateAdminAreaInput,
} from "../schemas/admin-area.schema";

export async function listAdminAreas() {
  const db = getDatabase();

  return db
    .select({
      id: areasTable.id,
      name: areasTable.name,
      slug: areasTable.slug,

      shortDescription:
        areasTable.shortDescription,

      active: areasTable.active,
      sortOrder: areasTable.sortOrder,
      createdAt: areasTable.createdAt,
      updatedAt: areasTable.updatedAt,

      categoryCount: sql<number>`
        (
          select count(*)::int
          from ${areaCategories}
          where ${areaCategories.areaId}
            = ${areasTable.id}
        )
      `,
    })
    .from(areasTable)
    .orderBy(
      asc(areasTable.sortOrder),
      asc(areasTable.name),
    );
}

export async function findAdminAreaBySlug(
  slug: string,
) {
  const db = getDatabase();

  const [area] = await db
    .select({
      id: areasTable.id,
      slug: areasTable.slug,
    })
    .from(areasTable)
    .where(
      eq(areasTable.slug, slug),
    )
    .limit(1);

  return area ?? null;
}

export async function createAdminArea(
  input: CreateAdminAreaInput,
) {
  const db = getDatabase();

  const [area] = await db
    .insert(areasTable)
    .values({
      name: input.name,
      slug: input.slug,

      shortDescription:
        input.shortDescription ?? null,

      description:
        input.description ?? null,

      active: input.active,
      sortOrder: input.sortOrder,

      seoTitle:
        input.seoTitle ?? null,

      seoDescription:
        input.seoDescription ?? null,
    })
    .returning({
      id: areasTable.id,
      name: areasTable.name,
      slug: areasTable.slug,
      active: areasTable.active,
      sortOrder: areasTable.sortOrder,
    });

  return area ?? null;
}

export async function findAdminAreaById(
  areaId: string,
) {
  const db = getDatabase();

  const [area] = await db
    .select({
      id: areasTable.id,
      name: areasTable.name,
      slug: areasTable.slug,

      shortDescription:
        areasTable.shortDescription,

      description:
        areasTable.description,

      icon:
        areasTable.icon,

      imageUrl:
        areasTable.imageUrl,

      imagePublicId:
        areasTable.imagePublicId,

      active:
        areasTable.active,

      sortOrder:
        areasTable.sortOrder,

      seoTitle:
        areasTable.seoTitle,

      seoDescription:
        areasTable.seoDescription,

      createdAt:
        areasTable.createdAt,

      updatedAt:
        areasTable.updatedAt,
    })
    .from(areasTable)
    .where(
      eq(
        areasTable.id,
        areaId,
      ),
    )
    .limit(1);

  return area ?? null;
}

export async function updateAdminArea(
  input: UpdateAdminAreaInput,
) {
  const db = getDatabase();

  const [area] = await db
    .update(areasTable)
    .set({
      name: input.name,
      slug: input.slug,

      shortDescription:
        input.shortDescription ?? null,

      description:
        input.description ?? null,

      active: input.active,

      sortOrder:
        input.sortOrder,

      seoTitle:
        input.seoTitle ?? null,

      seoDescription:
        input.seoDescription ?? null,

      updatedAt: new Date(),
    })
    .where(
      eq(
        areasTable.id,
        input.id,
      ),
    )
    .returning({
      id: areasTable.id,
      name: areasTable.name,
      slug: areasTable.slug,
      active: areasTable.active,
      sortOrder: areasTable.sortOrder,
    });

  return area ?? null;
}