import type { MetadataRoute } from "next";

import { getAbsoluteUrl } from "@/config/site";
import { getPublicCatalogFilters } from "@/features/catalog/services/catalog-filter.service";
import { getPublicProducts } from "@/features/catalog/services/product.service";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, { categories }] = await Promise.all([
    getPublicProducts({ sort: "newest", filters: {} }),
    getPublicCatalogFilters(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: getAbsoluteUrl("/productos"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    { url: getAbsoluteUrl("/areas"), changeFrequency: "weekly", priority: 0.8 },
    {
      url: getAbsoluteUrl("/categorias"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/contacto"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => category.count > 0)
    .map((category) => ({
      url: getAbsoluteUrl(`/categorias/${encodeURIComponent(category.slug)}`),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: getAbsoluteUrl(`/productos/${encodeURIComponent(product.slug)}`),
    lastModified: product.updatedAt ?? product.publishedAt ?? undefined,
    changeFrequency: "weekly",
    priority: product.featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
