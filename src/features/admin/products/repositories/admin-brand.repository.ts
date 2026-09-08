import "server-only";

import {
  asc,
  eq,
  sql,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
  brands as brandsTable,
  products as productsTable,
} from "@/db/schema";

import type {
  CreateAdminBrandInput,
  UpdateAdminBrandInput,
} from "../schemas/admin-brand.schema";

export async function listAdminBrands() {
  const db = getDatabase();

  return db
    .select({
      id: brandsTable.id,
      name: brandsTable.name,
      slug: brandsTable.slug,
      description: brandsTable.description,

      logoUrl:
        brandsTable.logoUrl,

      logoPublicId:
        brandsTable.logoPublicId,

      active:
        brandsTable.active,

      createdAt:
        brandsTable.createdAt,

      updatedAt:
        brandsTable.updatedAt,

      productCount: sql<number>`
        (
          select count(*)::int
          from ${productsTable}
          where ${productsTable.brandId}
            = ${brandsTable.id}
        )
      `,
    })
    .from(brandsTable)
    .orderBy(
      asc(brandsTable.name),
    );
}

export async function findAdminBrandById(
  brandId: string,
) {
  const db = getDatabase();

  const [brand] = await db
    .select({
      id: brandsTable.id,
      name: brandsTable.name,
      slug: brandsTable.slug,
      description: brandsTable.description,

      logoUrl:
        brandsTable.logoUrl,

      logoPublicId:
        brandsTable.logoPublicId,

      active:
        brandsTable.active,

      createdAt:
        brandsTable.createdAt,

      updatedAt:
        brandsTable.updatedAt,
    })
    .from(brandsTable)
    .where(
      eq(
        brandsTable.id,
        brandId,
      ),
    )
    .limit(1);

  return brand ?? null;
}

export async function findAdminBrandBySlug(
  slug: string,
) {
  const db = getDatabase();

  const [brand] = await db
    .select({
      id: brandsTable.id,
      slug: brandsTable.slug,
    })
    .from(brandsTable)
    .where(
      eq(
        brandsTable.slug,
        slug,
      ),
    )
    .limit(1);

  return brand ?? null;
}

export async function createAdminBrand(
  input: CreateAdminBrandInput,
) {
  const db = getDatabase();

  const [brand] = await db
    .insert(brandsTable)
    .values({
      name: input.name,
      slug: input.slug,

      description:
        input.description ?? null,

      active: input.active,
    })
    .returning({
      id: brandsTable.id,
      name: brandsTable.name,
      slug: brandsTable.slug,
      active: brandsTable.active,
    });

  return brand ?? null;
}

export async function updateAdminBrand(
  input: UpdateAdminBrandInput,
) {
  const db = getDatabase();

  const [brand] = await db
    .update(brandsTable)
    .set({
      name: input.name,
      slug: input.slug,

      description:
        input.description ?? null,

      active: input.active,
      updatedAt: new Date(),
    })
    .where(
      eq(
        brandsTable.id,
        input.id,
      ),
    )
    .returning({
      id: brandsTable.id,
      name: brandsTable.name,
      slug: brandsTable.slug,
      active: brandsTable.active,
    });

  return brand ?? null;
}