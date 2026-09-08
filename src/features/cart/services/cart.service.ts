import { cartSchema } from "../schemas/cart.schema";
import { findCartVariantsByIds } from "../repositories/cart.repository";

export type CartIssueCode =
  | "not_found"
  | "unpublished_product"
  | "unsupported_sale_mode"
  | "inactive_variant"
  | "purchase_disabled"
  | "missing_price"
  | "out_of_stock"
  | "quantity_adjusted";

interface CartIssue {
  variantId: string;
  code: CartIssueCode;
  message: string;
}

export async function resolveCart(
  input: unknown,
) {
  const requestedItems = cartSchema.parse(input);

  const variants = await findCartVariantsByIds(
    requestedItems.map(
      (item) => item.variantId,
    ),
  );

  const variantsById = new Map(
    variants.map((variant) => [
      variant.id,
      variant,
    ]),
  );

  const items = [];
  const issues: CartIssue[] = [];

  for (const requestedItem of requestedItems) {
    const variant = variantsById.get(
      requestedItem.variantId,
    );

    if (!variant) {
      issues.push({
        variantId: requestedItem.variantId,
        code: "not_found",
        message:
          "El producto ya no está disponible.",
      });
      continue;
    }

    if (variant.product.status !== "published") {
      issues.push({
        variantId: variant.id,
        code: "unpublished_product",
        message:
          "El producto ya no está publicado.",
      });

      continue;
    }

    if (
      variant.product.saleMode !==
      "direct_purchase"
    ) {
      issues.push({
        variantId: variant.id,
        code: "unsupported_sale_mode",
        message:
          "Este producto no admite compra directa.",
      });

      continue;
    }

    if (!variant.active) {
      issues.push({
        variantId: variant.id,
        code: "inactive_variant",
        message:
          "La variante seleccionada ya no está activa.",
      });

      continue;
    }

    if (!variant.purchaseEnabled) {
      issues.push({
        variantId: variant.id,
        code: "purchase_disabled",
        message:
          "La compra de esta variante está deshabilitada.",
      });

      continue;
    }

    if (variant.priceInCents === null) {
      issues.push({
        variantId: variant.id,
        code: "missing_price",
        message:
          "La variante no tiene un precio disponible.",
      });

      continue;
    }

    const maximumQuantity =
      !variant.trackInventory ||
      variant.allowBackorder
        ? 99
        : variant.stock;

    if (maximumQuantity <= 0) {
      issues.push({
        variantId: variant.id,
        code: "out_of_stock",
        message:
          "La variante no tiene existencias disponibles.",
      });

      continue;
    }

    const quantity = Math.min(
      requestedItem.quantity,
      maximumQuantity,
    );

    if (quantity !== requestedItem.quantity) {
      issues.push({
        variantId: variant.id,
        code: "quantity_adjusted",
        message: `La cantidad se ajustó a ${quantity} por disponibilidad.`,
      });
    }

    const image =
      variant.product.images[0] ?? null;

    items.push({
      variantId: variant.id,
      productId: variant.product.id,
      name: variant.product.name,
      slug: variant.product.slug,

      brand:
        variant.product.brand?.active
          ? variant.product.brand.name
          : null,

      image: image
        ? {
            url: image.url,
            altText:
              image.altText ??
              variant.product.name,
            width: image.width,
            height: image.height,
          }
        : null,

      variantName: variant.name,
      sku: variant.sku,
      model: variant.model,

      priceInCents: Number(
        variant.priceInCents,
      ),

      compareAtPriceInCents:
        variant.compareAtPriceInCents === null
          ? null
          : Number(
              variant.compareAtPriceInCents,
            ),

      quantity,
      maximumQuantity,
      trackInventory:
        variant.trackInventory,
      allowBackorder:
        variant.allowBackorder,
    });
  }

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );

  const subtotalInCents = items.reduce(
    (total, item) =>
      total +
      item.priceInCents * item.quantity,
    0,
  );

  return {
    items,
    issues,

    summary: {
      totalItems,
      subtotalInCents,
    },
  };
}

export type ResolvedCart = Awaited<
  ReturnType<typeof resolveCart>
>;

export type ResolvedCartItem =
  ResolvedCart["items"][number];