import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAbsoluteUrl } from "@/config/site";
import { CatalogPageLayout } from "@/features/catalog/components/catalog-page-layout";
import {
  getPublicCatalogFilters,
  getPublicCategoryMetadataBySlug,
} from "@/features/catalog/services/catalog-filter.service";
import { getPublicProducts } from "@/features/catalog/services/product.service";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryMetadataBySlug(slug);

  if (!category) {
    return { title: "Categoría no encontrada", robots: { index: false } };
  }

  return {
    title: category.title,
    description:
      category.summary ??
      `Explora productos de ${category.name} para hospitales, clínicas y consultorios.`,
    alternates: {
      canonical: `/categorias/${category.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, filterOptions, products] = await Promise.all([
    getPublicCategoryMetadataBySlug(slug),
    getPublicCatalogFilters(),
    getPublicProducts({
      sort: "featured",
      filters: { categories: [slug] },
    }),
  ]);

  if (!category) {
    notFound();
  }

  const breadcrumbJsonLd = {
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
        name: "Categorías",
        item: getAbsoluteUrl("/categorias"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: getAbsoluteUrl(`/categorias/${slug}`),
      },
    ],
  };

  return (
    <>
      <CatalogPageLayout
        title={category.name}
        description={
          category.summary ?? `Explora nuestros productos de ${category.name}.`
        }
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Categorías", href: "/categorias" },
          { label: category.name },
        ]}
        filters={filterOptions}
        selectedFilters={{
          area: [],
          category: [slug],
          brand: [],
          inStock: false,
          minPrice: "",
          maxPrice: "",
        }}
        products={products}
        sort="featured"
        basePath="/productos"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
