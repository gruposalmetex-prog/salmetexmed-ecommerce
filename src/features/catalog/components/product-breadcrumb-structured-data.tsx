import { getAbsoluteUrl } from "@/config/site";

import type { PublicProduct } from "../services/product.service";

interface ProductBreadcrumbStructuredDataProps {
  product: PublicProduct;
}

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(
    /</g,
    "\\u003c",
  );
}

export function ProductBreadcrumbStructuredData({
  product,
}: ProductBreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: getAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Productos",
        item: getAbsoluteUrl("/productos"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item:
          product.seo.canonicalUrl ??
          getAbsoluteUrl(
            `/productos/${product.slug}`,
          ),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          serializeJsonLd(structuredData),
      }}
    />
  );
}