CREATE TABLE "area_categories" (
	"area_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "area_categories_area_id_category_id_pk" PRIMARY KEY("area_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(140) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"short_description" varchar(320),
	"description" text,
	"image_url" text,
	"image_public_id" varchar(255),
	"active" boolean DEFAULT true NOT NULL,
	"seo_title" varchar(70),
	"seo_description" varchar(170),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "area_categories" ADD CONSTRAINT "area_categories_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_categories" ADD CONSTRAINT "area_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "area_categories_category_index" ON "area_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "area_categories_sort_order_index" ON "area_categories" USING btree ("area_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_active_index" ON "categories" USING btree ("active");