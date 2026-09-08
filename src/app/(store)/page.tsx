
import { Hero } from "@/components/Home/Hero";
import { AreasCarousel } from "@/features/catalog/components/carousels/areas-carousel";
import { CategoriesCarousel } from "@/features/catalog/components/carousels/categories-carousel";
import { FeaturedProductsCarousel } from "@/features/catalog/components/carousels/featured-products-carousel";
import { getPublicCatalogFilters } from "@/features/catalog/services/catalog-filter.service";
import { getFeaturedProducts } from "@/features/catalog/services/product.service";
import { SuccessCasesCarousel } from "@/features/success-cases/components/success-cases-carousel";

export default async function Home() {
  const [
    featuredProducts,
    catalogFilters,

  ] = await Promise.all([
    getFeaturedProducts(8),
    getPublicCatalogFilters(),
  ]);

  return (
   <main>
   <Hero/>
   <AreasCarousel areas={catalogFilters.areas}/>
   <CategoriesCarousel categories={catalogFilters.categories}/>
   <FeaturedProductsCarousel products={featuredProducts}/>
   <SuccessCasesCarousel/>
   </main>
  );
}