import { z } from "zod";

export const favoriteProductIdsSchema = z
  .array(
    z
      .string()
      .uuid(
        "El identificador del producto no es válido",
      ),
  )
  .max(
    100,
    "No se pueden consultar más de 100 favoritos",
  )
  .superRefine(
    (productIds, context) => {
      const uniqueIds =
        new Set<string>();

      productIds.forEach(
        (productId, index) => {
          if (uniqueIds.has(productId)) {
            context.addIssue({
              code: "custom",
              path: [index],
              message:
                "El producto está duplicado",
            });

            return;
          }

          uniqueIds.add(productId);
        },
      );
    },
  );

export type FavoriteProductIds =
  z.output<
    typeof favoriteProductIdsSchema
  >;