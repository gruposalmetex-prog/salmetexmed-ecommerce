import {
  createAdminProduct,
  findAdminProductById,
  findAdminProductVariantContext,
  getAdminProductCounts,
  insertAdminProductVariant,
  listAdminProductFormOptions,
  listAdminProducts,
  markAdminProductAsPublished,
  markPublishedAdminProductAsDraft,
  updateAdminProductRecord,
  updateAdminProductVariantRecord,
  type AdminProductListFilters,
  type AdminProductStatus,
} from "../repositories/admin-product.repository";

import type {
  CreateAdminProductVariantInput,
  UpdateAdminProductVariantInput,
} from "../schemas/admin-product-variant.schema";

import type { UpdateAdminProductInput } from "../schemas/admin-product.schema";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface AdminProductQuery {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

function normalizePage(value: number | undefined) {
  if (!value || !Number.isInteger(value) || value < 1) {
    return 1;
  }

  return value;
}

function normalizePageSize(value: number | undefined) {
  if (!value || !Number.isInteger(value) || value < 1) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(value, MAX_PAGE_SIZE);
}

function normalizeStatus(
  value: string | undefined,
): AdminProductStatus | undefined {
  if (value === "draft" || value === "published" || value === "archived") {
    return value;
  }

  return undefined;
}

export async function getAdminProducts(query: AdminProductQuery = {}) {
  const page = normalizePage(query.page);

  const pageSize = normalizePageSize(query.pageSize);

  const filters: AdminProductListFilters = {
    page,
    pageSize,

    search: query.search?.trim() || undefined,

    status: normalizeStatus(query.status),
  };

  const result = await listAdminProducts(filters);

  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

  return {
    products: result.records.map((product) => {
      const activeVariants = product.variants.filter(
        (variant) => variant.active,
      );

      const trackedVariants = activeVariants.filter(
        (variant) => variant.trackInventory,
      );

      const stock = trackedVariants.reduce(
        (total, variant) => total + variant.stock,
        0,
      );

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        status: product.status,
        saleMode: product.saleMode,
        featured: product.featured,

        publishedAt: product.publishedAt,

        createdAt: product.createdAt,

        updatedAt: product.updatedAt,

        brand: product.brand
          ? {
              name: product.brand.name,

              slug: product.brand.slug,
            }
          : null,

        image: product.images[0] ?? null,

        variantCount: product.variants.length,

        activeVariantCount: activeVariants.length,

        inventory: {
          stock,

          tracksInventory: trackedVariants.length > 0,

          hasUntrackedVariants: activeVariants.some(
            (variant) => !variant.trackInventory,
          ),

          allowsBackorder: activeVariants.some(
            (variant) => variant.allowBackorder,
          ),
        },
      };
    }),

    pagination: {
      page,
      pageSize,
      totalItems: result.total,
      totalPages,

      hasPreviousPage: page > 1,

      hasNextPage: page < totalPages,
    },

    filters: {
      search: filters.search ?? "",

      status: filters.status ?? "all",
    },
  };
}

export async function getAdminDashboardSummary() {
  const result = await getAdminProductCounts();

  const counts = {
    draft: 0,
    published: 0,
    archived: 0,
  };

  for (const row of result.statusRows) {
    counts[row.status] = Number(row.count) || 0;
  }

  return {
    totalProducts: counts.draft + counts.published + counts.archived,

    publishedProducts: counts.published,

    draftProducts: counts.draft,

    archivedProducts: counts.archived,

    variantCount: result.variantCount,
  };
}

export async function getAdminProductById(productId: string) {
  return findAdminProductById(productId);
}

export type AdminProductDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminProductById>>
>;

export type AdminProductUpdateErrorCode =
  | "product_not_found"
  | "product_archived"
  | "slug_locked"
  | "published_product_incomplete"
  | "update_failed";

export class AdminProductUpdateError extends Error {
  constructor(
    public readonly code: AdminProductUpdateErrorCode,

    message: string,
  ) {
    super(message);

    this.name = "AdminProductUpdateError";
  }
}

export async function updateAdminProduct(input: UpdateAdminProductInput) {
  const currentProduct = await findAdminProductById(input.productId);

  if (!currentProduct) {
    throw new AdminProductUpdateError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (currentProduct.status === "archived") {
    throw new AdminProductUpdateError(
      "product_archived",
      "Un producto archivado no puede modificarse.",
    );
  }

  if (
    currentProduct.status === "published" &&
    input.slug !== currentProduct.slug
  ) {
    throw new AdminProductUpdateError(
      "slug_locked",
      "El slug no puede modificarse mientras el producto está publicado.",
    );
  }

  if (
    currentProduct.status === "published" &&
    input.saleMode === "direct_purchase"
  ) {
    const hasPurchasableVariant = currentProduct.variants.some(
      (variant) =>
        variant.active &&
        variant.purchaseEnabled &&
        variant.priceInCents !== null &&
        variant.priceInCents > 0,
    );

    if (!hasPurchasableVariant) {
      throw new AdminProductUpdateError(
        "published_product_incomplete",
        "No puedes cambiar un producto publicado a compra directa hasta que tenga una variante activa, con compra habilitada y precio.",
      );
    }
  }

  const updatedProduct = await updateAdminProductRecord(input);

  if (!updatedProduct) {
    throw new AdminProductUpdateError(
      "update_failed",
      "No fue posible actualizar el producto.",
    );
  }

  return {
    ...updatedProduct,

    previousSlug: currentProduct.slug,
  };
}

export type AdminProductVariantErrorCode =
  | "product_not_found"
  | "variant_not_found"
  | "product_archived"
  | "product_not_allowed";

export class AdminProductVariantError extends Error {
  constructor(
    public readonly code: AdminProductVariantErrorCode,

    message: string,
  ) {
    super(message);

    this.name = "AdminProductVariantError";
  }
}

export async function createAdminProductVariant(
  input: CreateAdminProductVariantInput,
) {
  const product = await findAdminProductVariantContext(input.productId);

  if (!product) {
    throw new AdminProductVariantError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (product.status === "archived") {
    throw new AdminProductVariantError(
      "product_archived",
      "El producto está archivado.",
    );
  }

  return insertAdminProductVariant({
    ...input,

    stock: input.trackInventory ? input.stock : 0,

    allowBackorder: input.trackInventory ? input.allowBackorder : false,
  });
}

export async function updateAdminProductVariant(
  input: UpdateAdminProductVariantInput,
) {
  const product = await findAdminProductById(input.productId);

  if (!product) {
    throw new AdminProductVariantError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (product.status === "archived") {
    throw new AdminProductVariantError(
      "product_archived",
      "El producto está archivado.",
    );
  }

  const currentVariant = product.variants.find(
    (variant) => variant.id === input.variantId,
  );

  if (!currentVariant) {
    throw new AdminProductVariantError(
      "variant_not_found",
      "La variante no existe o no pertenece a este producto.",
    );
  }
  if (
    product.status === "published" &&
    product.saleMode === "direct_purchase"
  ) {
    const willRemainPurchasable = product.variants.some((variant) => {
      if (variant.id === input.variantId) {
        return (
          input.active &&
          input.purchaseEnabled &&
          input.priceInCents !== null &&
          input.priceInCents > 0
        );
      }

      return (
        variant.active &&
        variant.purchaseEnabled &&
        variant.priceInCents !== null &&
        variant.priceInCents > 0
      );
    });

    if (!willRemainPurchasable) {
      throw new AdminProductVariantError(
        "product_not_allowed",
        "El producto está publicado y debe conservar al menos una variante activa, habilitada para compra y con precio.",
      );
    }
  }

  const updatedVariant = await updateAdminProductVariantRecord({
    ...input,

    stock: input.trackInventory ? input.stock : 0,

    allowBackorder: input.trackInventory ? input.allowBackorder : false,
  });

  if (!updatedVariant) {
    throw new AdminProductVariantError(
      "variant_not_found",
      "La variante no existe o no pertenece a este producto.",
    );
  }

  return updatedVariant;
}

export interface AdminProductPublicationCheck {
  key: "general" | "variant" | "image" | "document";

  label: string;
  complete: boolean;
  required: boolean;
  description: string;
}

export interface AdminProductPublicationReadiness {
  canPublish: boolean;

  checks: AdminProductPublicationCheck[];

  missingRequirements: string[];
}

export function getAdminProductPublicationReadiness(
  product: AdminProductDetail,
): AdminProductPublicationReadiness {
  const generalComplete =
    product.name.trim().length > 0 &&
    product.slug.trim().length > 0 &&
    product.shortDescription.trim().length > 0 &&
    product.description.trim().length > 0 &&
    product.categoryLinks.length > 0;

  const requiresPurchasableVariant = product.saleMode === "direct_purchase";

  const hasPurchasableVariant = product.variants.some(
    (variant) =>
      variant.active &&
      variant.purchaseEnabled &&
      variant.priceInCents !== null &&
      variant.priceInCents > 0,
  );

  const hasPrimaryImage = product.images.some((image) => image.isPrimary);

  const hasDocument = product.documents.length > 0;

  const checks: AdminProductPublicationCheck[] = [
    {
      key: "general",
      label: "Información general",

      complete: generalComplete,

      required: true,

      description: "Nombre, slug, descripciones y categoría.",
    },
    {
      key: "variant",

      label: requiresPurchasableVariant
        ? "Variante disponible para compra"
        : "Variantes",

      complete: requiresPurchasableVariant
        ? hasPurchasableVariant
        : product.variants.length > 0,

      required: requiresPurchasableVariant,

      description: requiresPurchasableVariant
        ? "Se requiere una variante activa, con compra habilitada y precio."
        : "Agregar variantes es opcional para esta modalidad de venta.",
    },
    {
      key: "image",
      label: "Imagen principal",

      complete: hasPrimaryImage,

      required: false,

      description:
        "Opcional. Se utilizará la imagen predeterminada si no agregas una.",
    },
    {
      key: "document",
      label: "Documentación",

      complete: hasDocument,

      required: false,

      description:
        "Las fichas técnicas, manuales y otros documentos son opcionales.",
    },
  ];

  const missingRequirements = checks
    .filter((check) => check.required && !check.complete)
    .map((check) => check.label);

  return {
    canPublish: missingRequirements.length === 0,

    checks,
    missingRequirements,
  };
}

export type AdminProductPublicationErrorCode =
  | "product_not_found"
  | "product_archived"
  | "product_incomplete"
  | "publication_failed"
  | "publication_withdrawal_failed";

export class AdminProductPublicationError extends Error {
  constructor(
    public readonly code: AdminProductPublicationErrorCode,

    message: string,

    public readonly missingRequirements: string[] = [],
  ) {
    super(message);

    this.name = "AdminProductPublicationError";
  }
}

export async function publishAdminProduct(productId: string) {
  const product = await findAdminProductById(productId);

  if (!product) {
    throw new AdminProductPublicationError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (product.status === "archived") {
    throw new AdminProductPublicationError(
      "product_archived",
      "Un producto archivado no puede publicarse.",
    );
  }

  const readiness = getAdminProductPublicationReadiness(product);

  if (!readiness.canPublish) {
    throw new AdminProductPublicationError(
      "product_incomplete",
      "El producto todavía no cumple los requisitos de publicación.",
      readiness.missingRequirements,
    );
  }

  if (product.status === "published") {
    return {
      id: product.id,
      slug: product.slug,
      status: product.status,
    };
  }

  const publishedProduct = await markAdminProductAsPublished(product.id);

  if (!publishedProduct) {
    throw new AdminProductPublicationError(
      "publication_failed",
      "No fue posible publicar el producto.",
    );
  }

  return publishedProduct;
}

export async function unpublishAdminProduct(productId: string) {
  const product = await findAdminProductById(productId);

  if (!product) {
    throw new AdminProductPublicationError(
      "product_not_found",
      "El producto no existe.",
    );
  }

  if (product.status === "archived") {
    throw new AdminProductPublicationError(
      "product_archived",
      "Un producto archivado no puede retirarse de publicación.",
    );
  }

  if (product.status === "draft") {
    return {
      id: product.id,
      slug: product.slug,
      status: product.status,
      publishedAt: null,
    };
  }

  const draftProduct = await markPublishedAdminProductAsDraft(product.id);

  if (!draftProduct) {
    throw new AdminProductPublicationError(
      "publication_withdrawal_failed",
      "No fue posible retirar la publicación del producto.",
    );
  }

  return draftProduct;
}

export async function getAdminProductFormOptions() {
  return listAdminProductFormOptions();
}

export type AdminProductList = Awaited<ReturnType<typeof getAdminProducts>>;

export type AdminProductListItem = AdminProductList["products"][number];

export type AdminDashboardSummary = Awaited<
  ReturnType<typeof getAdminDashboardSummary>
>;

export { createAdminProduct };
