import { z } from "zod";

export const createAdminCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe contener al menos 2 caracteres.")
    .max(140, "El nombre no puede superar los 140 caracteres."),

  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio.")
    .max(160, "El slug no puede superar los 160 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Utiliza letras minúsculas, números y guiones.",
    ),

  shortDescription: z
    .string()
    .trim()
    .max(
      320,
      "La descripción corta no puede superar los 320 caracteres.",
    )
    .optional()
    .transform((value) => value || undefined),

  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),

  active: z.boolean().default(true),

  seoTitle: z
    .string()
    .trim()
    .max(70, "El título SEO no puede superar los 70 caracteres.")
    .optional()
    .transform((value) => value || undefined),

  seoDescription: z
    .string()
    .trim()
    .max(
      170,
      "La descripción SEO no puede superar los 170 caracteres.",
    )
    .optional()
    .transform((value) => value || undefined),

  areaIds: z
    .array(z.uuid("El identificador del área no es válido."))
    .default([])
    .transform((areaIds) => [...new Set(areaIds)]),
});

export type CreateAdminCategoryInput = z.infer<
  typeof createAdminCategorySchema
>;

export const updateAdminCategorySchema =
  createAdminCategorySchema.extend({
    id: z.uuid(
      "El identificador de la categoría no es válido.",
    ),
  });

export type UpdateAdminCategoryInput = z.infer<
  typeof updateAdminCategorySchema
>;