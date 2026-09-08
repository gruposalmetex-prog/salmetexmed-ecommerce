import type { Metadata } from "next";

import { CheckoutView } from "@/features/checkout/components/checkout-view";

export const metadata: Metadata = {
  title:
    "Proceso de compra próximamente | SALMETEXMED",
  description:
    "Estamos preparando el proceso de compra en línea de SALMETEXMED.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}