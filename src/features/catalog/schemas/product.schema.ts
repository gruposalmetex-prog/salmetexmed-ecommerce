import { z } from "zod";

export const PRODUCT_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export const SALE_MODES = [
  "direct_purchase",
  "quote_only",
  "contact_only",
] as const;

const emptyStringToNull = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }
  return value;
};

const nullableText = (maxLength: number) =>
  z.preprocess(
    emptyStringToNull,
    z.string().trim().max(maxLength).nullable().optional(),
  );

export const productSchema = z
  .object({
    brandId: z.preprocess(
      emptyStringToNull,
      z.string().uuid("La marca seleccionada no es válida").nullable().optional(),
    ),

    name: z
      .string()
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(180, "El nombre no puede superar los 180 caracteres"),

    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "El slug debe tener al menos 3 caracteres")
      .max(200, "El slug no puede superar los 200 caracteres")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "El slug solo puede contener letras minúsculas, números y guiones",
      ),

    shortDescription: z
      .string()
      .trim()
      .min(10, "La descripción corta debe tener al menos 10 caracteres")
      .max(320, "La descripción corta no puede superar los 320 caracteres"),

    description: z
      .string()
      .trim()
      .min(20, "La descripción debe tener al menos 20 caracteres"),

    status: z.enum(PRODUCT_STATUSES).default("draft"),

    saleMode: z.enum(SALE_MODES).default("quote_only"),

    featured: z.boolean().default(false),

    seoTitle: nullableText(70),

    seoDescription: nullableText(170),

    canonicalUrl: z.preprocess(
      emptyStringToNull,
      z
        .string()
        .trim()
        .url("La URL canónica no es válida")
        .nullable()
        .optional(),
    ),
  })
  .strict();

export type ProductInput = z.input<typeof productSchema>;
export type ValidatedProduct = z.output<typeof productSchema>;