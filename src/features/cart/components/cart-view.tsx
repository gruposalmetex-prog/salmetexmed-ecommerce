"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import type { ResolvedCartItem } from "../services/cart.service";
import { useResolvedCart } from "../hooks/use-resolved-cart";
import { CartEmpty } from "./cart-empty";
import {
  CartError,
  CartIssues,
  CartLoading,
  CartUpdating,
} from "./cart-feedback";
import { CartProduct } from "./cart-product";
import { useCart } from "./cart-provider";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const {
    isReady,
    updateQuantity,
    removeItem,
  } = useCart();

  const {
    cart,
    error,
    isLoading,
    retry,
  } = useResolvedCart();

  const items = cart?.items ?? [];

  const totalItems =
    cart?.summary.totalItems ?? 0;

  const subtotalInCents =
    cart?.summary.subtotalInCents ?? 0;

  function increaseQuantity(
    item: ResolvedCartItem,
  ) {
    updateQuantity(
      item.variantId,
      Math.min(
        item.quantity + 1,
        item.maximumQuantity,
      ),
    );
  }

  function decreaseQuantity(
    item: ResolvedCartItem,
  ) {
    updateQuantity(
      item.variantId,
      Math.max(1, item.quantity - 1),
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="transition hover:text-sky-700"
          >
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span className="font-medium text-slate-800">
            Carrito
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Tu carrito
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {totalItems === 0
              ? "Aún no tienes productos en tu carrito."
              : `${totalItems} ${
                  totalItems === 1
                    ? "producto"
                    : "productos"
                } en tu carrito.`}
          </p>
        </div>

        {isLoading && cart && (
          <CartUpdating />
        )}

        {error && cart && (
          <CartError
            message={error}
            onRetry={retry}
            compact
          />
        )}

        {cart && cart.issues.length > 0 && (
          <CartIssues
            issues={cart.issues}
            onRemove={removeItem}
          />
        )}

        {!isReady ||
        (isLoading && !cart) ? (
          <CartLoading />
        ) : error && !cart ? (
          <CartError
            message={error}
            onRetry={retry}
          />
        ) : items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
            <div>
              <div className="border-y border-slate-200">
                {items.map((item) => (
                  <CartProduct
                    key={item.variantId}
                    item={item}
                    onIncrease={() =>
                      increaseQuantity(item)
                    }
                    onDecrease={() =>
                      decreaseQuantity(item)
                    }
                    onRemove={() =>
                      removeItem(
                        item.variantId,
                      )
                    }
                  />
                ))}
              </div>

              <Link
                href="/productos"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Seguir comprando
              </Link>
            </div>

            <CartSummary
              totalItems={totalItems}
              subtotalInCents={
                subtotalInCents
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}