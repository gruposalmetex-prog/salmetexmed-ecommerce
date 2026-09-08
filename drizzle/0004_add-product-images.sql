CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"alt_text" varchar(180) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"format" varchar(20),
	"bytes" integer,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_images_width_positive" CHECK ("product_images"."width" > 0),
	CONSTRAINT "product_images_height_positive" CHECK ("product_images"."height" > 0),
	CONSTRAINT "product_images_bytes_nonnegative" CHECK ("product_images"."bytes" IS NULL OR "product_images"."bytes" >= 0),
	CONSTRAINT "product_images_sort_order_nonnegative" CHECK ("product_images"."sort_order" >= 0)
);
--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_images_public_id_unique" ON "product_images" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_images_primary_unique" ON "product_images" USING btree ("product_id") WHERE "product_images"."is_primary" = true;--> statement-breakpoint
CREATE INDEX "product_images_product_order_index" ON "product_images" USING btree ("product_id","sort_order");