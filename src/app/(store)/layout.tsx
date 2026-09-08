import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";

import { CartProvider } from "@/features/cart/components/cart-provider";
import { FavoritesProvider } from "@/features/favorites/favorites-provider";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({
  children,
}: StoreLayoutProps) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <WhatsAppFloat />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}