import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductStructuredData } from "@/features/catalog/components/product-structured-data";

import { getAbsoluteUrl, siteConfig } from "@/config/site";

import { ProductDetail } from "@/features/catalog/components/product-detail";

import {
  getPublicProductBySlug,
  getRelatedProducts,
} from "@/features/catalog/services/product.service";
import { ProductBreadcrumbStructuredData } from "@/features/catalog/components/product-breadcrumb-structured-data";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getProduct = cache((slug: string) => getPublicProductBySlug(slug));

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl =
    product.seo.canonicalUrl ?? getAbsoluteUrl(`/productos/${product.slug}`);

  const primaryImage =
    product.images.find((image) => image.isPrimary) ??
    product.images[0] ??
    null;

  const title = product.seo.title ?? product.name;

  const description =
    product.seo.description ?? product.shortDescription ?? undefined;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      locale: siteConfig.openGraphLocale,
      siteName: siteConfig.name,
      url: canonicalUrl,
      title,
      description,

      images: primaryImage
        ? [
            {
              url: primaryImage.url,
              width: primaryImage.width,
              height: primaryImage.height,
              alt: primaryImage.altText ?? product.name,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      images: primaryImage ? [primaryImage.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <>
      <ProductStructuredData product={product} />

      <ProductBreadcrumbStructuredData product={product} />

      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </>
  );
}
