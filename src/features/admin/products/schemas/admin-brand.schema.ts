import { z } from "zod";

export const createAdminBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "El nombre debe contener al menos 2 caracteres.",
    )
    .max(
      120,
      "El nombre no puede superar los 120 caracteres.",
    ),

  slug: z
    .string()
    .trim()
    .min(
      2,
      "El slug es obligatorio.",
    )
    .max(
      140,
      "El slug no puede superar los 140 caracteres.",
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Utiliza letras minúsculas, números y guiones.",
    ),

  description: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),

  active: z.boolean().default(true),
});

export const updateAdminBrandSchema =
  createAdminBrandSchema.extend({
    id: z.uuid(
      "El identificador de la marca no es válido.",
    ),
  });

export type CreateAdminBrandInput = z.infer<
  typeof createAdminBrandSchema
>;

export type UpdateAdminBrandInput = z.infer<
  typeof updateAdminBrandSchema
>;