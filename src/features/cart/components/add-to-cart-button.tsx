"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "./cart-provider";

interface AddToCartButtonProps {
  variantId: string;
  productName: string;
}

export function AddToCartButton({
  variantId,
  productName,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [wasAdded, setWasAdded] =
    useState(false);

  useEffect(() => {
    if (!wasAdded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setWasAdded(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [wasAdded]);

  function handleAddToCart() {
    addItem(variantId, 1);
    setWasAdded(true);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      aria-label={`Agregar ${productName} al carrito`}
      className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-700 px-6 text-sm font-semibold text-white transition hover:bg-sky-800"
    >
      {wasAdded ? (
        <>
          <Check className="h-4 w-4" />
          Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Agregar al carrito
        </>
      )}
    </button>
  );
}