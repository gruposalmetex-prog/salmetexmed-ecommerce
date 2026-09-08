import type { MetadataRoute } from "next";

import { getAbsoluteUrl } from "@/config/site";
import { getPublicProducts } from "@/features/catalog/services/product.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts({
    sort: "newest",
    filters: {},
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getAbsoluteUrl("/productos"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl("/areas"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
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

  const productPages: MetadataRoute.Sitemap =
    products.map((product) => ({
      url: getAbsoluteUrl(
        `/productos/${encodeURIComponent(product.slug)}`,
      ),

      lastModified:
        product.publishedAt ?? undefined,

      changeFrequency: "weekly",
      priority: product.featured ? 0.8 : 0.7,
    }));

  return [
    ...staticPages,
    ...productPages,
  ];
}