import { cache } from "react";
import {
  findPublicAreaMetadataBySlug,
  findPublicCategoryMetadataBySlug,
  listCatalogFilterOptions,
} from "../repositories/catalog-filter.repository";

export async function getPublicCatalogFilters() {
  const filters = await listCatalogFilterOptions();

  return {
    areas: filters.areas.map((area) => ({
      ...area,
      count: Number(area.count),
    })),

    categories: filters.categories.map(
      (category) => ({
        ...category,
        count: Number(category.count),
      }),
    ),

    brands: filters.brands.map((brand) => ({
      ...brand,
      count: Number(brand.count),
    })),
  };
}

export type PublicCatalogFilters = Awaited<
  ReturnType<typeof getPublicCatalogFilters>
>;

export const getPublicCategoryMetadataBySlug =
  cache(
    async (
      slug: string,
    ) => {
      const category =
        await findPublicCategoryMetadataBySlug(
          slug,
        );

      if (!category) {
        return null;
      }

      return {
        ...category,

        title:
          category.seoTitle ??
          category.name,

        summary:
          category.seoDescription ??
          category.shortDescription ??
          category.description,
      };
    },
  );

export const getPublicAreaMetadataBySlug =
  cache(
    async (slug: string) => {
      const area =
        await findPublicAreaMetadataBySlug(
          slug,
        );

      if (!area) {
        return null;
      }

      return {
        ...area,

        title:
          area.seoTitle ??
          area.name,

        summary:
          area.seoDescription ??
          area.shortDescription ??
          area.description,
      };
    },
  );