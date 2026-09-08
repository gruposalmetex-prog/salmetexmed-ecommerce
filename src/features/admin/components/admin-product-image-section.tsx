import Image from "next/image";
import { CheckCircle2, ImageIcon, Star } from "lucide-react";
import { CreateAdminProductImageForm } from "../products/components/create-admin-product-image-form";
import { DeleteAdminProductImageButton } from "../products/components/delete-admin-product-image-button";

interface ProductImageItem {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface AdminProductImageSectionProps {
  productId: string;
  productName: string;
  images: ProductImageItem[];
  imageCreated?: boolean;
}

export function AdminProductImageSection({
  productId,
  productName,
  images,
  imageCreated = false,
}: AdminProductImageSectionProps) {
  const sortedImages = [...images].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );

  return (
    <div className="space-y-6">
      {imageCreated && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Imagen guardada
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              La imagen se subió y quedó relacionada correctamente con el
              producto.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Galería del producto
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            La imagen principal aparecerá primero en el catálogo y en el detalle
            del producto.
          </p>
        </div>

        {sortedImages.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedImages.map((image) => (
              <article
                key={image.id}
                className={`group overflow-hidden rounded-2xl border bg-white transition ${
                  image.isPrimary
                    ? "border-sky-300 ring-2 ring-sky-100"
                    : "border-slate-200"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  {image.isPrimary && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-sky-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Principal
                    </span>
                  )}

                  <span className="absolute bottom-3 right-3 rounded-md bg-slate-950/75 px-2 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
                    #{image.sortOrder + 1}
                  </span>
                </div>

                <div className="p-4">
                  <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-700">
                    {image.altText}
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="min-w-0 truncate font-mono text-[10px] text-slate-400">
                      {image.id}
                    </p>

                    <DeleteAdminProductImageButton
                      productId={productId}
                      imageId={image.id}
                      imageAltText={image.altText}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <ImageIcon className="mx-auto h-9 w-9 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              Todavía no hay imágenes
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
              Sube la primera imagen utilizando el formulario. Se establecerá
              automáticamente como principal.
            </p>
          </div>
        )}
      </section>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-950">
            {images.length > 0
              ? "Agregar otra imagen"
              : "Agregar primera imagen"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Los archivos se almacenarán en Cloudinary y sus metadatos en
            PostgreSQL.
          </p>
        </div>

        <CreateAdminProductImageForm
          productId={productId}
          productName={productName}
          hasImages={images.length > 0}
        />
      </div>
    </div>
  );
}
