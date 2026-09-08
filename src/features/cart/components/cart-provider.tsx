"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "salmetexmed-cart";

export interface StoredCartItem {
  variantId: string;
  quantity: number;
}

interface CartContextValue {
  items: StoredCartItem[];
  totalItems: number;
  isReady: boolean;
  addItem: (variantId: string, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

function parseStoredCart(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is StoredCartItem =>
        typeof item === "object" &&
        item !== null &&
        "variantId" in item &&
        typeof item.variantId === "string" &&
        "quantity" in item &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<StoredCartItem[]>([]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrationTimeout = window.setTimeout(() => {
      const storedItems = parseStoredCart(
        window.localStorage.getItem(CART_STORAGE_KEY),
      );

      setItems(storedItems);
      setIsReady(true);
    }, 0);

    return () => {
      window.clearTimeout(hydrationTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  const addItem = useCallback((variantId: string, quantity = 1) => {
    setItems((currentItems) => {
      const amount = Math.min(99, Math.max(1, quantity));

      const existingItem = currentItems.find(
        (item) => item.variantId === variantId,
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            variantId,
            quantity: amount,
          },
        ];
      }

      return currentItems.map((item) =>
        item.variantId === variantId
          ? {
              ...item,
              quantity: Math.min(99, item.quantity + amount),
            }
          : item,
      );
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity < 1 || quantity > 99) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.variantId === variantId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.variantId !== variantId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      isReady,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      totalItems,
      isReady,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider.");
  }

  return context;
}
