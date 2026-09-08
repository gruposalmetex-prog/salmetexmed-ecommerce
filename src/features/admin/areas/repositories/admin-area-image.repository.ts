import "server-only";

import {
  and,
  eq,
} from "drizzle-orm";

import { getDatabase } from "@/db";
import {
  areas as areasTable,
} from "@/db/schema";

export async function findAdminAreaImageContext(
  areaId: string,
) {
  const db = getDatabase();

  const [area] = await db
    .select({
      id: areasTable.id,
      name: areasTable.name,
      active: areasTable.active,

      imageUrl:
        areasTable.imageUrl,

      imagePublicId:
        areasTable.imagePublicId,
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

interface SaveAdminAreaImageInput {
  areaId: string;
  url: string;
  publicId: string;
}

export async function saveAdminAreaImage(
  input: SaveAdminAreaImageInput,
) {
  const db = getDatabase();

  const [area] = await db
    .update(areasTable)
    .set({
      imageUrl: input.url,

      imagePublicId:
        input.publicId,

      updatedAt: new Date(),
    })
    .where(
      eq(
        areasTable.id,
        input.areaId,
      ),
    )
    .returning({
      id: areasTable.id,
      name: areasTable.name,
      imageUrl: areasTable.imageUrl,
      imagePublicId:
        areasTable.imagePublicId,
    });

  return area ?? null;
}

export async function clearAdminAreaImage(
  areaId: string,
  publicId: string,
) {
  const db = getDatabase();

  const [area] = await db
    .update(areasTable)
    .set({
      imageUrl: null,
      imagePublicId: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(
          areasTable.id,
          areaId,
        ),
        eq(
          areasTable.imagePublicId,
          publicId,
        ),
      ),
    )
    .returning({
      id: areasTable.id,
    });

  return area ?? null;
}