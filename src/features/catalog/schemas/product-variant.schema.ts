import { z } from "zod";

const emptyStringToNull = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
};

const nullablePrice = z.preprocess(
  emptyStringToNull,
  z
    .coerce
    .number()
    .int("El precio debe expresarse en centavos enteros")
    .nonnegative("El precio no puede ser negativo")
    .nullable()
    .optional(),
);

export const productVariantSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(140, "El nombre no puede superar los 140 caracteres"),

    sku: z
      .string()
      .trim()
      .toUpperCase()
      .min(2, "El SKU debe tener al menos 2 caracteres")
      .max(80, "El SKU no puede superar los 80 caracteres")
      .regex(
        /^[A-Z0-9._-]+$/,
        "El SKU solo puede contener letras, números, puntos, guiones y guiones bajos",
      ),

    barcode: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(80).nullable().optional(),
    ),

    model: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(120).nullable().optional(),
    ),

    attributes: z.record(z.string(), z.string()).default({}),

    priceInCents: nullablePrice,

    compareAtPriceInCents: nullablePrice,

    purchaseEnabled: z.boolean().default(false),

    trackInventory: z.boolean().default(true),

    stock: z.coerce
      .number()
      .int("El inventario debe ser un número entero")
      .nonnegative("El inventario no puede ser negativo")
      .default(0),

    allowBackorder: z.boolean().default(false),

    active: z.boolean().default(true),

    isDefault: z.boolean().default(false),

    sortOrder: z.coerce
      .number()
      .int("El orden debe ser un número entero")
      .nonnegative("El orden no puede ser negativo")
      .default(0),
  })
  .strict()
  .superRefine((variant, context) => {
    if (variant.purchaseEnabled && variant.priceInCents == null) {
      context.addIssue({
        code: "custom",
        path: ["priceInCents"],
        message: "Una variante disponible para compra necesita un precio",
      });
    }

    if (
      variant.priceInCents != null &&
      variant.compareAtPriceInCents != null &&
      variant.compareAtPriceInCents < variant.priceInCents
    ) {
      context.addIssue({
        code: "custom",
        path: ["compareAtPriceInCents"],
        message: "El precio anterior no puede ser menor que el precio actual",
      });
    }
  });

export type ProductVariantInput = z.input<
  typeof productVariantSchema
>;

export type ValidatedProductVariant = z.output<
  typeof productVariantSchema
>;