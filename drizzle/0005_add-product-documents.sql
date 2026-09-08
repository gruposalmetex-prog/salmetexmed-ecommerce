CREATE TYPE "public"."product_document_type" AS ENUM('technical_sheet', 'manual', 'certificate', 'brochure');--> statement-breakpoint
CREATE TABLE "product_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"document_type" "product_document_type" DEFAULT 'technical_sheet' NOT NULL,
	"title" varchar(160) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"mime_type" varchar(100) DEFAULT 'application/pdf' NOT NULL,
	"bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_documents_bytes_positive" CHECK ("product_documents"."bytes" > 0),
	CONSTRAINT "product_documents_pdf_only" CHECK ("product_documents"."mime_type" = 'application/pdf')
);
--> statement-breakpoint
ALTER TABLE "product_documents" ADD CONSTRAINT "product_documents_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_documents_product_type_unique" ON "product_documents" USING btree ("product_id","document_type");--> statement-breakpoint
CREATE UNIQUE INDEX "product_documents_public_id_unique" ON "product_documents" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "product_documents_type_index" ON "product_documents" USING btree ("document_type");