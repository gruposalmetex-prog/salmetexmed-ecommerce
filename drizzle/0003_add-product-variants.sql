CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" varchar(140) NOT NULL,
	"sku" varchar(80) NOT NULL,
	"barcode" varchar(80),
	"model" varchar(120),
	"attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"price_in_cents" bigint,
	"compare_at_price_in_cents" bigint,
	"purchase_enabled" boolean DEFAULT false NOT NULL,
	"track_inventory" boolean DEFAULT true NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"allow_backorder" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_price_nonnegative" CHECK ("product_variants"."price_in_cents" IS NULL OR "product_variants"."price_in_cents" >= 0),
	CONSTRAINT "product_variants_compare_price_nonnegative" CHECK ("product_variants"."compare_at_price_in_cents" IS NULL OR "product_variants"."compare_at_price_in_cents" >= 0),
	CONSTRAINT "product_variants_compare_price_valid" CHECK (
        "product_variants"."compare_at_price_in_cents" IS NULL
        OR "product_variants"."price_in_cents" IS NULL
        OR "product_variants"."compare_at_price_in_cents" >= "product_variants"."price_in_cents"
      ),
	CONSTRAINT "product_variants_stock_nonnegative" CHECK ("product_variants"."stock" >= 0)
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_sku_unique" ON "product_variants" USING btree (lower("sku"));--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_barcode_unique" ON "product_variants" USING btree ("barcode");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_default_unique" ON "product_variants" USING btree ("product_id") WHERE "product_variants"."is_default" = true;--> statement-breakpoint
CREATE INDEX "product_variants_product_index" ON "product_variants" USING btree ("product_id","active","sort_order");