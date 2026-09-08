import {
    getAbsoluteUrl,
    siteConfig,
  } from "@/config/site";

  import type { PublicProduct } from "../services/product.service";

  interface ProductStructuredDataProps {
    product: PublicProduct;
  }

  function serializeJsonLd(data: unknown) {
    return JSON.stringify(data).replace(
      /</g,
      "\\u003c",
    );
  }

  export function ProductStructuredData({
    product,
  }: ProductStructuredDataProps) {
    const canonicalUrl =
      product.seo.canonicalUrl ??
      getAbsoluteUrl(
        `/productos/${product.slug}`,
      );

    const defaultVariant =
      product.variants.find(
        (variant) => variant.isDefault,
      ) ??
      product.variants[0] ??
      null;

    const images = product.images.map(
      (image) => image.url,
    );

    const availability =
      defaultVariant &&
      (!defaultVariant.trackInventory ||
        defaultVariant.stock > 0)
        ? "https://schema.org/InStock"
        : defaultVariant?.allowBackorder
          ? "https://schema.org/BackOrder"
          : "https://schema.org/OutOfStock";

    const offer =
      product.saleMode === "direct_purchase" &&
      defaultVariant?.canPurchase &&
      defaultVariant.priceInCents !== null
        ? {
            "@type": "Offer",
            url: canonicalUrl,

            priceCurrency:
              siteConfig.currency,

            price: (
              defaultVariant.priceInCents / 100
            ).toFixed(2),

            availability,

            itemCondition:
              "https://schema.org/NewCondition",

            seller: {
              "@type": "Organization",
              name: siteConfig.name,
            },
          }
        : undefined;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",

      name: product.name,
      description:
        product.shortDescription ??
        product.description ??
        undefined,

      url: canonicalUrl,

      image:
        images.length > 0
          ? images
          : undefined,

      sku: defaultVariant?.sku,
      model: defaultVariant?.model,

      brand: product.brand
        ? {
            "@type": "Brand",
            name: product.brand.name,
          }
        : undefined,

      category:
        product.categories.length > 0
          ? product.categories
              .map(
                (category) =>
                  category.name,
              )
              .join(", ")
          : undefined,

      additionalProperty:
        defaultVariant
          ? Object.entries(
              defaultVariant.attributes,
            ).map(([name, value]) => ({
              "@type": "PropertyValue",
              name,
              value,
            }))
          : undefined,

      offers: offer,
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