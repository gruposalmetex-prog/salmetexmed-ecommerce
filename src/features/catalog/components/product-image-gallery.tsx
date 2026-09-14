"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import type { PublicProduct } from "../services/product.service";

import {
  getProductPlaceholderAlt,
  PRODUCT_PLACEHOLDER_IMAGE_URL,
} from "../product-image.constants";

interface ProductImageGalleryProps {
  productName: string;
  featured: boolean;
  images: PublicProduct["images"];
}

export function ProductImageGallery({
  productName,
  featured,
  images,
}: ProductImageGalleryProps) {
  const primaryIndex = images.findIndex((image) => image.isPrimary);

  const [selectedIndex, setSelectedIndex] = useState(
    primaryIndex >= 0 ? primaryIndex : 0,
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const selectedImage = images[selectedIndex] ?? images[0] ?? null;

  const selectedUrl = selectedImage?.url ?? PRODUCT_PLACEHOLDER_IMAGE_URL;

  const selectedAlt =
    selectedImage?.altText || getProductPlaceholderAlt(productName);

  const showPreviousImage = useCallback(() => {
    setSelectedIndex((currentIndex) =>
      currentIndex <= 0 ? images.length - 1 : currentIndex - 1,
    );
  }, [images.length]);

  const showNextImage = useCallback(() => {
    setSelectedIndex((currentIndex) =>
      currentIndex >= images.length - 1 ? 0 : currentIndex + 1,
    );
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        showPreviousImage();
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        showNextImage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, images.length, showNextImage, showPreviousImage]);

  return (
    <>
      <div>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-8 lg:p-12">
          <button
            type="button"
            disabled={!selectedImage}
            aria-label={
              selectedImage ? `Ampliar imagen de ${productName}` : undefined
            }
            onClick={() => setLightboxOpen(true)}
            className="group cursor-pointer relative h-full w-full disabled:cursor-default"
          >
            <Image
              src={selectedUrl}
              alt={selectedAlt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              preload
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {selectedImage && (
              <span className="absolute bottom-0 right-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100">
                <ZoomIn className="h-4 w-4" />
                Ampliar
              </span>
            )}
          </button>

          {featured && (
            <span className="pointer-events-none absolute left-5 top-5 rounded-md bg-slate-950 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
              Destacado
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div
            aria-label="Imágenes del producto"
            className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5"
          >
            {images.map((image, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={image.url}
                  type="button"
                  aria-label={`Ver imagen ${index + 1} de ${productName}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative cursor-pointer aspect-square overflow-hidden rounded-lg border bg-slate-50 p-2 transition ${
                    isSelected
                      ? "border-sky-600 ring-2 ring-sky-100"
                      : "border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <span className="relative block h-full w-full">
                    <Image
                      src={image.url}
                      alt={image.altText || productName}
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightboxOpen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${productName}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxOpen(false);
            }
          }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            aria-label="Cerrar imagen ampliada"
            onClick={() => setLightboxOpen(false)}
            className="absolute cursor-pointer right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Imagen anterior"
                onClick={showPreviousImage}
                className="absolute left-3 cursor-pointer z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100 sm:left-8"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                aria-label="Imagen siguiente"
                onClick={showNextImage}
                className="absolute right-3 cursor-pointer z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100 sm:right-8"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative h-[85vh] w-full max-w-6xl">
            <Image
              src={selectedImage.url}
              alt={selectedAlt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <span className="absolute bottom-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 sm:bottom-8">
              {selectedIndex + 1} de {images.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
