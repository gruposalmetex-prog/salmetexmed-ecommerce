"use client";

import Link from "next/link";
import { Heart} from "lucide-react";
import { useFavorites } from "../favorites-provider";

export function FavoritesNavbarLink() {
  const {
    totalFavorites,
    isReady,
  } = useFavorites();

  const displayedQuantity =
    totalFavorites > 99
      ? "99+"
      : totalFavorites;

  const accessibleLabel =
    totalFavorites === 0
      ? "Favoritos"
      : `${totalFavorites} ${
          totalFavorites === 1
            ? "producto favorito"
            : "productos favoritos"
        }`;

  return (
    <Link
      href="/favoritos"
      aria-label={accessibleLabel}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
    >
      <Heart className="h-5 w-5" />

      {isReady && totalFavorites > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white"
        >
          {displayedQuantity}
        </span>
      )}
    </Link>
  );
}