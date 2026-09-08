import { z } from "zod";

export const adminCategoryImageSchema = z.object({
  categoryId: z.uuid(
    "El identificador de la categoría no es válido.",
  ),
});

export type AdminCategoryImageInput = z.infer<
  typeof adminCategoryImageSchema
>;