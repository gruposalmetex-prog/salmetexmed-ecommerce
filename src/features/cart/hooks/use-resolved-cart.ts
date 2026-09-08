"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { ResolvedCart } from "../services/cart.service";
import { useCart } from "../components/cart-provider";

const emptyCart: ResolvedCart = {
  items: [],
  issues: [],
  summary: {
    totalItems: 0,
    subtotalInCents: 0,
  },
};

export function useResolvedCart() {
  const {
    items: requestedItems,
    isReady,
    updateQuantity,
  } = useCart();

  const hasRequestedItems =
    requestedItems.length > 0;

  const [cart, setCart] =
    useState<ResolvedCart | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [requestVersion, setRequestVersion] =
    useState(0);

  const retry = useCallback(() => {
    setRequestVersion(
      (currentVersion) =>
        currentVersion + 1,
    );
  }, []);

  useEffect(() => {
    if (
      !isReady ||
      !hasRequestedItems
    ) {
      return;
    }

    const controller =
      new AbortController();

    async function resolve() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/cart/resolve",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              requestedItems,
            ),
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo validar el carrito.",
          );
        }

        const resolvedCart =
          (await response.json()) as ResolvedCart;

        if (controller.signal.aborted) {
          return;
        }

        setCart(resolvedCart);

        for (const item of resolvedCart.items) {
          const requestedItem =
            requestedItems.find(
              (requested) =>
                requested.variantId ===
                item.variantId,
            );

          if (
            requestedItem &&
            requestedItem.quantity !==
            item.quantity
          ) {
            updateQuantity(
              item.variantId,
              item.quantity,
            );
          }
        }
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo validar el carrito.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void resolve();

    return () => {
      controller.abort();
    };
  }, [
    isReady,
    hasRequestedItems,
    requestedItems,
    requestVersion,
    updateQuantity,
  ]);

  return {
    cart:
      isReady && !hasRequestedItems
        ? emptyCart
        : cart,

    error:
      isReady && !hasRequestedItems
        ? null
        : error,

    isLoading:
      isReady && hasRequestedItems
        ? isLoading
        : false,

    retry,
  };
}