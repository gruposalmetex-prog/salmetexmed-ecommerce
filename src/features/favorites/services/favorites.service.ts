import {
    getPublicProducts,
    type PublicProductCard,
  } from "@/features/catalog/services/product.service";

  import { favoriteProductIdsSchema } from "../schema/favorites.schema";

  export async function resolveFavorites(
    input: unknown,
  ) {
    const productIds =
      favoriteProductIdsSchema.parse(input);

    if (productIds.length === 0) {
      return {
        products: [] as PublicProductCard[],
        missingProductIds: [] as string[],
      };
    }

    const products =
      await getPublicProducts({
        filters: {
          ids: productIds,
        },
      });

    const productsById = new Map(
      products.map((product) => [
        product.id,
        product,
      ]),
    );
    const resolvedProducts = productIds
      .map((productId) =>
        productsById.get(productId),
      )
      .filter(
        (
          product,
        ): product is PublicProductCard =>
          product !== undefined,
      );

    const missingProductIds =
      productIds.filter(
        (productId) =>
          !productsById.has(productId),
      );

    return {
      products: resolvedProducts,
      missingProductIds,
    };
  }

  export type ResolvedFavorites =
    Awaited<
      ReturnType<
        typeof resolveFavorites
      >
    >;