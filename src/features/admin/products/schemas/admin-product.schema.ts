import { z } from "zod";

const optionalText = (
  maximumLength: number,
) =>
  z.preprocess(
    (value) => {
      if (
        typeof value !== "string"
      ) {
        return value;
      }

      const normalized =
        value.trim();

      return normalized || undefined;
    },

    z
      .string()
      .max(maximumLength)
      .optional(),
  );

const optionalUuid =
  z.preprocess(
    (value) =>
      value === ""
        ? null
        : value,

    z
      .uuid("La marca seleccionada no es válida.")
      .nullable(),
  );

export const createAdminProductSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        3,
        "El nombre debe tener al menos 3 caracteres.",
      )
      .max(
        180,
        "El nombre no puede superar 180 caracteres.",
      ),

    slug: z
      .string()
      .trim()
      .min(
        3,
        "El slug debe tener al menos 3 caracteres.",
      )
      .max(
        200,
        "El slug no puede superar 200 caracteres.",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Utiliza letras minúsculas, números y guiones.",
      ),

    brandId: optionalUuid,

    categoryIds: z
      .array(
        z.uuid(
          "Una categoría seleccionada no es válida.",
        ),
      )
      .min(
        1,
        "Selecciona al menos una categoría.",
      ),

    shortDescription: z
      .string()
      .trim()
      .min(
        10,
        "La descripción corta debe tener al menos 10 caracteres.",
      )
      .max(
        320,
        "La descripción corta no puede superar 320 caracteres.",
      ),

    description: z
      .string()
      .trim()
      .min(
        20,
        "La descripción debe tener al menos 20 caracteres.",
      ),

    saleMode: z.enum([
      "direct_purchase",
      "quote_only",
      "contact_only",
    ]),

    featured: z.boolean(),

    seoTitle: optionalText(70),

    seoDescription:
      optionalText(170),
  });

export type CreateAdminProductInput =
  z.infer<
    typeof createAdminProductSchema
  >;

export const updateAdminProductSchema = createAdminProductSchema.extend({
  productId: z.uuid(
    "El producto seleccionado no es válido.",
  ),
});

export type UpdateAdminProductInput = z.infer<typeof updateAdminProductSchema>;