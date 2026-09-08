import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { ResolvedCartItem } from "../services/cart.service";
import { formatPrice } from "../utils/format-price";
import {
  getProductPlaceholderAlt,
  PRODUCT_PLACEHOLDER_IMAGE_URL,
} from "@/features/catalog/product-image.constants";

interface CartProductProps {
  item: ResolvedCartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartProduct({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartProductProps) {
  const availabilityText =
    item.trackInventory && !item.allowBackorder
      ? `${item.maximumQuantity} disponibles`
      : item.allowBackorder
        ? "Disponible sobre pedido"
        : "Disponible";

  return (
    <article className="grid gap-5 border-b border-slate-200 py-6 last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)]">
      <Link
        href={`/productos/${item.slug}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-slate-50"
      >
        <Image
          src={item.image?.url ?? PRODUCT_PLACEHOLDER_IMAGE_URL}
          alt={item.image?.altText || getProductPlaceholderAlt(item.name)}
          fill
          sizes="150px"
          className="object-contain p-4"
        />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            {item.brand && (
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                {item.brand}
              </span>
            )}

            <Link href={`/productos/${item.slug}`}>
              <h2 className="mt-1 text-base font-semibold leading-6 text-slate-950 transition hover:text-sky-700 sm:text-lg">
                {item.name}
              </h2>
            </Link>

            <p className="mt-2 text-sm text-slate-500">{item.variantName}</p>

            {item.sku && (
              <p className="mt-1 text-xs text-slate-400">SKU: {item.sku}</p>
            )}

            {item.model && (
              <p className="mt-1 text-xs text-slate-400">
                Modelo: {item.model}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Eliminar ${item.name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-5 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 block text-xs font-medium text-slate-500">
              Cantidad
            </span>

            <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={onDecrease}
                disabled={item.quantity <= 1}
                aria-label={`Disminuir cantidad de ${item.name}`}
                className="flex h-full cursor-pointer w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="flex min-w-10 items-center justify-center text-sm font-semibold text-slate-900">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={onIncrease}
                disabled={item.quantity >= item.maximumQuantity}
                aria-label={`Aumentar cantidad de ${item.name}`}
                className="flex h-full cursor-pointer w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">{availabilityText}</p>
          </div>

          <div className="sm:text-right">
            <span className="block text-sm text-slate-500">
              {formatPrice(item.priceInCents)} c/u
            </span>

            <span className="mt-1 block text-xl font-semibold tracking-tight text-slate-950">
              {formatPrice(item.priceInCents * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
