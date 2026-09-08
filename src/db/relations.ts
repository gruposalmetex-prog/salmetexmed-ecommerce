import { relations } from "drizzle-orm";

import {
  areaCategories,
  areas,
  brands,
  categories,
  productCategories,
  productDocuments,
  productImages,
  products,
  productVariants,
} from "./schema";

export const areasRelations = relations(
  areas,
  ({ many }) => ({
    categoryLinks: many(areaCategories),
  }),
);

export const areaCategoriesRelations = relations(
  areaCategories,
  ({ one }) => ({
    area: one(areas, {
      fields: [areaCategories.areaId],
      references: [areas.id],
    }),

    category: one(categories, {
      fields: [areaCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const brandsRelations = relations(
  brands,
  ({ many }) => ({
    products: many(products),
  }),
);

export const categoriesRelations = relations(
  categories,
  ({ many }) => ({
    areaLinks: many(areaCategories),
    productLinks: many(productCategories),
  }),
);

export const productsRelations = relations(
  products,
  ({ one, many }) => ({
    brand: one(brands, {
      fields: [products.brandId],
      references: [brands.id],
    }),

    categoryLinks: many(productCategories),

    variants: many(productVariants),

    images: many(productImages),

    documents: many(productDocuments),
  }),
);

export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),

    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);

export const productImagesRelations = relations(
  productImages,
  ({ one }) => ({
    product: one(products, {
      fields: [productImages.productId],
      references: [products.id],
    }),
  }),
);

export const productDocumentsRelations = relations(
  productDocuments,
  ({ one }) => ({
    product: one(products, {
      fields: [productDocuments.productId],
      references: [products.id],
    }),
  }),
);