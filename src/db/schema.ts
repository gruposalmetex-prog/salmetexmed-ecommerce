import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  bigint,
  check,
  jsonb,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
]);

export const saleModeEnum = pgEnum("sale_mode", [
  "direct_purchase",
  "quote_only",
  "contact_only",
]);

export const productDocumentTypeEnum = pgEnum(
  "product_document_type",
  [
    "technical_sheet",
    "manual",
    "certificate",
    "brochure",
  ],
);

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 120,
    }).notNull(),

    slug: varchar("slug", {
      length: 140,
    }).notNull(),

    description: text("description"),

    logoUrl: text("logo_url"),

    logoPublicId: varchar("logo_public_id", {
      length: 255,
    }),

    active: boolean("active").default(true).notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("brands_slug_unique").on(table.slug),
    index("brands_active_index").on(table.active),
  ],
);

export const areas = pgTable(
  "areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 140,
    }).notNull(),

    slug: varchar("slug", {
      length: 160,
    }).notNull(),

    shortDescription: varchar("short_description", {
      length: 320,
    }),

    description: text("description"),

    icon: varchar("icon", {
      length: 80,
    }),

    imageUrl: text("image_url"),

    imagePublicId: varchar(
      "image_public_id",
      {
        length: 255,
      },
    ),

    active: boolean("active").default(true).notNull(),

    sortOrder: integer("sort_order").default(0).notNull(),

    seoTitle: varchar("seo_title", {
      length: 70,
    }),

    seoDescription: varchar("seo_description", {
      length: 170,
    }),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("areas_slug_unique").on(table.slug),
    index("areas_active_index").on(table.active),
    index("areas_sort_order_index").on(table.sortOrder),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 140,
    }).notNull(),

    slug: varchar("slug", {
      length: 160,
    }).notNull(),

    shortDescription: varchar("short_description", {
      length: 320,
    }),

    description: text("description"),

    imageUrl: text("image_url"),

    imagePublicId: varchar("image_public_id", {
      length: 255,
    }),

    active: boolean("active").default(true).notNull(),

    seoTitle: varchar("seo_title", {
      length: 70,
    }),

    seoDescription: varchar("seo_description", {
      length: 170,
    }),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("categories_slug_unique").on(table.slug),
    index("categories_active_index").on(table.active),
  ],
);

export const areaCategories = pgTable(
  "area_categories",
  {
    areaId: uuid("area_id")
      .notNull()
      .references(() => areas.id, {
        onDelete: "cascade",
      }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
      }),

    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.areaId, table.categoryId],
    }),

    index("area_categories_category_index").on(table.categoryId),

    index("area_categories_sort_order_index").on(
      table.areaId,
      table.sortOrder,
    ),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    brandId: uuid("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),

    name: varchar("name", {
      length: 180,
    }).notNull(),

    slug: varchar("slug", {
      length: 200,
    }).notNull(),

    shortDescription: varchar("short_description", {
      length: 320,
    }).notNull(),

    description: text("description").notNull(),

    status: productStatusEnum("status").default("draft").notNull(),

    saleMode: saleModeEnum("sale_mode").default("quote_only").notNull(),

    featured: boolean("featured").default(false).notNull(),

    seoTitle: varchar("seo_title", {
      length: 70,
    }),

    seoDescription: varchar("seo_description", {
      length: 170,
    }),

    canonicalUrl: text("canonical_url"),

    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),

    index("products_brand_index").on(table.brandId),

    index("products_catalog_index").on(
      table.status,
      table.publishedAt,
    ),

    index("products_featured_index").on(
      table.status,
      table.featured,
    ),
  ],
);

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.productId, table.categoryId],
    }),

    index("product_categories_category_index").on(
      table.categoryId,
    ),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", {
      length: 140,
    }).notNull(),

    sku: varchar("sku", {
      length: 80,
    }).notNull(),

    barcode: varchar("barcode", {
      length: 80,
    }),

    model: varchar("model", {
      length: 120,
    }),

    attributes: jsonb("attributes")
      .$type<Record<string, string>>()
      .default({})
      .notNull(),

    priceInCents: bigint("price_in_cents", {
      mode: "number",
    }),

    compareAtPriceInCents: bigint("compare_at_price_in_cents", {
      mode: "number",
    }),

    purchaseEnabled: boolean("purchase_enabled")
      .default(false)
      .notNull(),

    trackInventory: boolean("track_inventory")
      .default(true)
      .notNull(),

    stock: integer("stock").default(0).notNull(),

    allowBackorder: boolean("allow_backorder")
      .default(false)
      .notNull(),

    active: boolean("active").default(true).notNull(),

    isDefault: boolean("is_default").default(false).notNull(),

    sortOrder: integer("sort_order").default(0).notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("product_variants_sku_unique").on(
      sql`lower(${table.sku})`,
    ),

    uniqueIndex("product_variants_barcode_unique").on(
      table.barcode,
    ),

    uniqueIndex("product_variants_default_unique")
      .on(table.productId)
      .where(sql`${table.isDefault} = true`),

    index("product_variants_product_index").on(
      table.productId,
      table.active,
      table.sortOrder,
    ),

    check(
      "product_variants_price_nonnegative",
      sql`${table.priceInCents} IS NULL OR ${table.priceInCents} >= 0`,
    ),

    check(
      "product_variants_compare_price_nonnegative",
      sql`${table.compareAtPriceInCents} IS NULL OR ${table.compareAtPriceInCents} >= 0`,
    ),

    check(
      "product_variants_compare_price_valid",
      sql`
        ${table.compareAtPriceInCents} IS NULL
        OR ${table.priceInCents} IS NULL
        OR ${table.compareAtPriceInCents} >= ${table.priceInCents}
      `,
    ),

    check(
      "product_variants_stock_nonnegative",
      sql`${table.stock} >= 0`,
    ),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    publicId: varchar("public_id", {
      length: 255,
    }).notNull(),

    url: text("url").notNull(),

    altText: varchar("alt_text", {
      length: 180,
    }).notNull(),

    width: integer("width").notNull(),

    height: integer("height").notNull(),

    format: varchar("format", {
      length: 20,
    }),

    bytes: integer("bytes"),

    isPrimary: boolean("is_primary")
      .default(false)
      .notNull(),

    sortOrder: integer("sort_order")
      .default(0)
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_images_public_id_unique").on(
      table.publicId,
    ),

    uniqueIndex("product_images_primary_unique")
      .on(table.productId)
      .where(sql`${table.isPrimary} = true`),

    index("product_images_product_order_index").on(
      table.productId,
      table.sortOrder,
    ),

    check(
      "product_images_width_positive",
      sql`${table.width} > 0`,
    ),

    check(
      "product_images_height_positive",
      sql`${table.height} > 0`,
    ),

    check(
      "product_images_bytes_nonnegative",
      sql`${table.bytes} IS NULL OR ${table.bytes} >= 0`,
    ),

    check(
      "product_images_sort_order_nonnegative",
      sql`${table.sortOrder} >= 0`,
    ),
  ],
);

export const productDocuments = pgTable(
  "product_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    documentType: productDocumentTypeEnum("document_type")
      .default("technical_sheet")
      .notNull(),

    title: varchar("title", {
      length: 160,
    }).notNull(),

    fileName: varchar("file_name", {
      length: 255,
    }).notNull(),

    publicId: varchar("public_id", {
      length: 255,
    }).notNull(),

    url: text("url").notNull(),

    mimeType: varchar("mime_type", {
      length: 100,
    })
      .default("application/pdf")
      .notNull(),

    bytes: integer("bytes").notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("product_documents_product_type_unique").on(
      table.productId,
      table.documentType,
    ),

    uniqueIndex("product_documents_public_id_unique").on(
      table.publicId,
    ),

    index("product_documents_type_index").on(
      table.documentType,
    ),

    check(
      "product_documents_bytes_positive",
      sql`${table.bytes} > 0`,
    ),

    check(
      "product_documents_pdf_only",
      sql`${table.mimeType} = 'application/pdf'`,
    ),
  ],
);
