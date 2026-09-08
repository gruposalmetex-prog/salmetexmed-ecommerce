import { z } from "zod";

export const productSearchQuerySchema = z
  .string()
  .trim()
  .min(
    2,
    "Escribe al menos 2 caracteres",
  )
  .max(
    100,
    "La búsqueda no puede superar 100 caracteres",
  )
  .transform((value) =>
    value.replace(/\s+/g, " "),
  );

export type ProductSearchQuery =
  z.output<
    typeof productSearchQuerySchema
  >;