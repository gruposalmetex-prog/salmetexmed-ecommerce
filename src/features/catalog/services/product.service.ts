import { findPublishedProductBySlug, listPublishedProducts, type ProductListFilters, } from "../repositories/product.repository"
import { productSearchQuerySchema } from "../schemas/search.schema";

export const PRODUCT_SORT_VALUES = [
    "featured",
    "newest",
    "price-asc",
    "price-desc",
    "name-asc",
] as const;

export type ProductSort =
    (typeof PRODUCT_SORT_VALUES)[number];

export function isProductSort(
    value: unknown,
): value is ProductSort {
    return (
        typeof value === "string" &&
        PRODUCT_SORT_VALUES.includes(
            value as ProductSort,
        )
    );
}

interface GetPublicProductsOptions {
    sort?: ProductSort;
    filters?: ProductListFilters;
    limit?: number;
}

export async function getPublicProductBySlug(slug: string) {
    const product = await findPublishedProductBySlug(slug)

    if (!product) {
        return null
    }

    const brand = product.brand?.active ? {
        name: product.brand.name,
        slug: product.brand.slug,
        logoUrl: product.brand.logoUrl,
    } : null

    const categories = product.categoryLinks
        .filter(({ category }) => category.active)
        .map(({ category }) => ({
            name: category.name,
            slug: category.slug,

            areas: category.areaLinks
                .filter(({ area }) => area.active)
                .map(({ area }) => ({
                    name: area.name,
                    slug: area.slug,
                })),
        }))

    const variants = product.variants
        .filter((variant) => variant.active)
        .map((variant) => {
            const hasAvailability =
                !variant.trackInventory ||
                variant.stock > 0 ||
                variant.allowBackorder;

            const canPurchase =
                product.saleMode === "direct_purchase" &&
                variant.purchaseEnabled &&
                variant.priceInCents !== null &&
                hasAvailability;

            return {
                id: variant.id,
                name: variant.name,
                sku: variant.sku,
                barcode: variant.barcode,
                model: variant.model,
                attributes: variant.attributes,

                priceInCents:
                    variant.priceInCents === null ? null : Number(variant.priceInCents),

                compareAtPriceInCents:
                    variant.compareAtPriceInCents === null ? null : Number(variant.compareAtPriceInCents),

                stock: variant.stock,
                trackInventory: variant.trackInventory,
                allowBackorder: variant.allowBackorder,
                isDefault: variant.isDefault,
                canPurchase,

            }

        })

    const images = product.images.map((image) => ({
        url: image.url,
        altText: image.altText,
        width: image.width,
        height: image.height,
        format: image.format,
        isPrimary: image.isPrimary,
    }));


    const documents = product.documents.map((document) => ({
        type: document.documentType,
        title: document.title,
        fileName: document.fileName,
        url: document.url,
        mimeType: document.mimeType,
        bytes: document.bytes,
    }));


    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        saleMode: product.saleMode,
        featured: product.featured,
        publishedAt: product.publishedAt,

        brand,
        categories,
        variants,
        images,
        documents,

        seo: {
            title: product.seoTitle ?? product.name,
            description:
                product.seoDescription ??
                product.shortDescription,
            canonicalUrl: product.canonicalUrl,
        },
    };


}

export async function getPublicProducts(
    options: GetPublicProductsOptions = {},
) {
    const products = await listPublishedProducts(options.filters, options.limit,);

    const publicProducts = products.map((product) => {
        const purchasableVariants = product.variants.filter(
            (variant) => {
                const hasAvailability =
                    !variant.trackInventory ||
                    variant.stock > 0 ||
                    variant.allowBackorder;

                return (
                    product.saleMode === "direct_purchase" && variant.purchaseEnabled && variant.priceInCents !== null && hasAvailability
                );
            },
        );

        const lowestPricedVariant = purchasableVariants.reduce<
            (typeof purchasableVariants)[number] | null
        >((lowest, variant) => {
            if (!lowest) {
                return variant;
            }

            return Number(variant.priceInCents) < Number(lowest.priceInCents) ? variant : lowest;
        }, null);

        const image = product.images[0] ?? null;

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            shortDescription: product.shortDescription,
            saleMode: product.saleMode,
            featured: product.featured,
            publishedAt: product.publishedAt,

            brand: product.brand?.active ? {
                name: product.brand.name,
                slug: product.brand.slug,
            }
                : null,

            image: image
                ? {
                    url: image.url,
                    altText: image.altText,
                    width: image.width,
                    height: image.height,
                    format: image.format,
                }
                : null,

            pricing: {
                priceInCents: lowestPricedVariant ? Number(lowestPricedVariant.priceInCents)
                    : null,

                compareAtPriceInCents:
                    lowestPricedVariant?.compareAtPriceInCents == null ? null : Number(
                        lowestPricedVariant.compareAtPriceInCents,
                    ),
                canPurchase: lowestPricedVariant !== null,
                purchasableVariantCount: purchasableVariants.length,
            },
        };
    });
    const sort = options.sort ?? "featured";

    return publicProducts.sort((first, second) => {
        if (sort === "newest") {
            return (
                (second.publishedAt?.getTime() ?? 0) -
                (first.publishedAt?.getTime() ?? 0)
            );
        }

        if (sort === "name-asc") {
            return first.name.localeCompare(
                second.name,
                "es",
            );
        }

        if (
            sort === "price-asc" ||
            sort === "price-desc"
        ) {
            const firstPrice =
                first.pricing.priceInCents;

            const secondPrice =
                second.pricing.priceInCents;
            if (firstPrice === null && secondPrice === null) {
                return 0;
            }

            if (firstPrice === null) {
                return 1;
            }

            if (secondPrice === null) {
                return -1;
            }

            return sort === "price-asc"
                ? firstPrice - secondPrice
                : secondPrice - firstPrice;
        }
        return 0;
    });
}

export async function getFeaturedProducts(
    limit = 8,
) {
    return getPublicProducts({
        sort: "featured",
        filters: {
            featured: true,
        },
        limit,
    });
}

export async function getRelatedProducts(
    product: PublicProduct,
    limit = 4,
): Promise<PublicProductCard[]> {
    const categorySlugs = product.categories.map(
        (category) => category.slug,
    );

    if (categorySlugs.length === 0) {
        return [];
    }

    const products = await getPublicProducts({
        sort: "featured",
        filters: {
            categories: categorySlugs,
        },
    });

    return products
        .filter(
            (relatedProduct) =>
                relatedProduct.id !== product.id,
        )
        .slice(0, limit);
}

export type PublicProductCard = Awaited<
    ReturnType<typeof getPublicProducts>
>[number];

export type PublicProduct = NonNullable<
    Awaited<ReturnType<typeof getPublicProductBySlug>>
>;

export async function getPublicProductSearchSuggestions(
    input: unknown,
    limit = 6,
) {
    const search =
        productSearchQuerySchema.parse(
            input,
        );

    const safeLimit = Math.min(
        8,
        Math.max(1, limit),
    );

    const products =
        await getPublicProducts({
            sort: "featured",
            filters: {
                search,
            },
            limit: safeLimit,
        });

    return products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        shortDescription:
            product.shortDescription,

        brand: product.brand
            ? {
                name: product.brand.name,
                slug: product.brand.slug,
            }
            : null,

        image: product.image
            ? {
                url: product.image.url,
                altText:
                    product.image.altText ??
                    product.name,
            }
            : null,

        pricing: {
            priceInCents:
                product.pricing
                    .priceInCents,
            canPurchase:
                product.pricing.canPurchase,
        },

        saleMode: product.saleMode,
    }));
}

export type PublicProductSearchSuggestion =
    Awaited<
        ReturnType<
            typeof getPublicProductSearchSuggestions
        >
    >[number];