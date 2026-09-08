import { z } from "zod";

function optionalText(
  maximumLength: number,
) {
  return z.preprocess(
    (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return null;
      }

      const normalized =
        String(value).trim();

      return normalized.length > 0
        ? normalized
        : null;
    },
    z
      .string()
      .max(maximumLength)
      .nullable(),
  );
}

const optionalPriceInCents =
  z.preprocess(
    (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return null;
      }

      const normalized =
        String(value)
          .trim()
          .replace(",", ".");

      if (!normalized) {
        return null;
      }

      const price = Number(normalized);

      if (!Number.isFinite(price)) {
        return value;
      }

      return Math.round(price * 100);
    },
    z
      .number({
        error:
          "Ingresa un precio válido",
      })
      .int()
      .nonnegative(
        "El precio no puede ser negativo",
      )
      .nullable(),
  );

export const createAdminProductVariantSchema =
  z
    .object({
      productId: z.uuid(
        "El producto no es válido",
      ),

      name: z
        .string()
        .trim()
        .min(
          2,
          "El nombre debe tener al menos 2 caracteres",
        )
        .max(
          140,
          "El nombre no puede superar 140 caracteres",
        ),

      sku: z
        .string()
        .trim()
        .min(
          2,
          "El SKU debe tener al menos 2 caracteres",
        )
        .max(
          80,
          "El SKU no puede superar 80 caracteres",
        )
        .transform((value) =>
          value.toUpperCase(),
        ),

      barcode: optionalText(80),

      model: optionalText(120),

      priceInCents:
        optionalPriceInCents,

      compareAtPriceInCents:
        optionalPriceInCents,

      purchaseEnabled: z.boolean(),

      trackInventory: z.boolean(),

      stock: z.coerce
        .number({
          error:
            "Ingresa una existencia válida",
        })
        .int(
          "La existencia debe ser un número entero",
        )
        .min(
          0,
          "La existencia no puede ser negativa",
        )
        .max(
          1_000_000,
          "La existencia supera el máximo permitido",
        ),

      allowBackorder: z.boolean(),

      active: z.boolean(),

      isDefault: z.boolean(),
    })
    .superRefine((variant, context) => {
      if (
        variant.purchaseEnabled &&
        variant.priceInCents === null
      ) {
        context.addIssue({
          code: "custom",
          path: ["priceInCents"],
          message:
            "Una variante disponible para compra necesita precio",
        });
      }

      if (
        variant.compareAtPriceInCents !==
          null &&
        variant.priceInCents === null
      ) {
        context.addIssue({
          code: "custom",
          path: [
            "compareAtPriceInCents",
          ],
          message:
            "Primero debes indicar el precio de venta",
        });
      }

      if (
        variant.compareAtPriceInCents !==
          null &&
        variant.priceInCents !== null &&
        variant.compareAtPriceInCents <=
          variant.priceInCents
      ) {
        context.addIssue({
          code: "custom",
          path: [
            "compareAtPriceInCents",
          ],
          message:
            "El precio anterior debe ser mayor que el precio de venta",
        });
      }

      if (
        !variant.trackInventory &&
        variant.allowBackorder
      ) {
        context.addIssue({
          code: "custom",
          path: ["allowBackorder"],
          message:
            "El inventario debe estar activo para permitir pedidos sin existencia",
        });
      }
    });

export type CreateAdminProductVariantInput =
  z.infer<
    typeof createAdminProductVariantSchema
  >;