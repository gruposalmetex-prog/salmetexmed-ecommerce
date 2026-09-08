import { z } from "zod";

export const createAdminAreaSchema = z.object({
    name: z
    .string()
    .trim()
    .min(
      2,
      "El nombre debe contener al menos 2 caracteres.",
    )
    .max(
      140,
      "El nombre no puede superar los 140 caracteres.",
    )
    .refine(
      (value) => value.length <= 140,
      {
        message:
          "El nombre no puede superar los 140 caracteres.",
      },
    ),

  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio.")
    .max(
      160,
      "El slug no puede superar los 160 caracteres.",
    )
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

  sortOrder: z.coerce
    .number()
    .int("El orden debe ser un número entero.")
    .min(0, "El orden no puede ser negativo.")
    .max(
      9999,
      "El orden no puede superar 9999.",
    )
    .default(0),

  seoTitle: z
    .string()
    .trim()
    .max(
      70,
      "El título SEO no puede superar los 70 caracteres.",
    )
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
});

export type CreateAdminAreaInput = z.infer<
  typeof createAdminAreaSchema
>;

export const updateAdminAreaSchema =
  createAdminAreaSchema.extend({
    id:z.uuid (
      "El identificador del área no es válido.",
    )
  });

  export type UpdateAdminAreaInput = z.infer<
  typeof updateAdminAreaSchema>;
