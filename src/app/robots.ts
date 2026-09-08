import type { MetadataRoute } from "next";

import {
  getAbsoluteUrl,
  siteConfig,
} from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (
      !process.env.VERCEL_ENV &&
      process.env.NODE_ENV === "production"
    );

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/carrito",
        "/checkout",
        "/favoritos",
      ],
    },

    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}