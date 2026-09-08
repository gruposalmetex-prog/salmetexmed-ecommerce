"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "./cart-provider";

export function CartNavbarLink() {
  const {
    totalItems,
    isReady,
  } = useCart();

  const displayedQuantity =
    totalItems > 99 ? "99+" : totalItems;

  const accessibleLabel =
    totalItems === 0
      ? "Carrito vacío"
      : `Carrito con ${totalItems} ${
          totalItems === 1
            ? "producto"
            : "productos"
        }`;

  return (
    <Link
      href="/carrito"
      aria-label={accessibleLabel}
      className="relative flex h-10 items-center gap-2 rounded-lg bg-sky-700 px-3 text-sm font-semibold text-white transition hover:bg-sky-800"
    >
      <ShoppingCart className="h-4 w-4" />

      <span className="hidden sm:inline">
        Carrito
      </span>

      {isReady && totalItems > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white"
        >
          {displayedQuantity}
        </span>
      )}
    </Link>
  );
}