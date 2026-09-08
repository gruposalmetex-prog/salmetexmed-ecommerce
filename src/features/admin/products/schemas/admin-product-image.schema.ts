import { z } from "zod";

export const createAdminProductImageSchema =
  z.object({
    productId: z.uuid(
      "El producto no es válido",
    ),

    altText: z
      .string()
      .trim()
      .min(
        5,
        "El texto alternativo debe tener al menos 5 caracteres",
      )
      .max(
        180,
        "El texto alternativo no puede superar 180 caracteres",
      ),

    isPrimary: z.boolean(),
  });

export type CreateAdminProductImageInput =
  z.infer<
    typeof createAdminProductImageSchema
  >;