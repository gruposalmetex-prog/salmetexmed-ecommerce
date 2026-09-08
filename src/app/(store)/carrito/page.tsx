import type { Metadata } from "next";

import { CartView } from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Carrito | SALMETEXMED",
  description:
    "Revisa los productos agregados a tu carrito antes de continuar con tu compra.",
};

export default function CartPage() {
  return <CartView />;
}