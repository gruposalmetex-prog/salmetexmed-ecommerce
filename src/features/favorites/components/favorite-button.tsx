"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "../favorites-provider";

type FavoriteButtonVariant =
  | "card"
  | "detail"
  | "overlay";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  variant?: FavoriteButtonVariant;
}

const variantClasses: Record<
  FavoriteButtonVariant,
  string
> = {
  card:
    "h-10 w-10 shrink-0 rounded-lg",
  detail:
    "h-12 w-12 shrink-0 rounded-lg",
  overlay:
    "h-9 w-9 rounded-full bg-white/95 shadow-sm backdrop-blur",
};

export function FavoriteButton({
  productId,
  productName,
  variant = "card",
}: FavoriteButtonProps) {
  const {
    isReady,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const selected =
    isReady && isFavorite(productId);

  const accessibleLabel = selected
    ? `Quitar ${productName} de favoritos`
    : `Agregar ${productName} a favoritos`;

  return (
    <button
      type="button"
      onClick={() =>
        toggleFavorite(productId)
      }
      disabled={!isReady}
      aria-label={accessibleLabel}
      aria-pressed={selected}
      title={accessibleLabel}
      className={`flex cursor-pointer items-center justify-center border transition disabled:cursor-wait disabled:opacity-60 ${
        variantClasses[variant]
      } ${
        selected
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
      }`}
    >
      <Heart
        className="h-5 w-5"
        strokeWidth={
          selected ? 2.4 : 2
        }
      />
    </button>
  );
}