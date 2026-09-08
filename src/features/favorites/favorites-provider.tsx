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

const FAVORITES_STORAGE_KEY =
  "salmetexmed-favorites";

interface FavoritesContextValue {
  productIds: string[];
  totalFavorites: number;
  isReady: boolean;
  isFavorite: (
    productId: string,
  ) => boolean;
  toggleFavorite: (
    productId: string,
  ) => void;
  removeFavorite: (
    productId: string,
  ) => void;
  clearFavorites: () => void;
}

const FavoritesContext =
  createContext<FavoritesContextValue | null>(
    null,
  );

interface FavoritesProviderProps {
  children: ReactNode;
}

function parseStoredFavorites(
  value: string | null,
): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(
        parsed.filter(
          (
            productId,
          ): productId is string =>
            typeof productId ===
              "string" &&
            productId.length > 0,
        ),
      ),
    );
  } catch {
    return [];
  }
}

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [
    productIds,
    setProductIds,
  ] = useState<string[]>([]);

  const [
    isReady,
    setIsReady,
  ] = useState(false);

  useEffect(() => {
    const hydrationTimeout =
      window.setTimeout(() => {
        const storedFavorites =
          parseStoredFavorites(
            window.localStorage.getItem(
              FAVORITES_STORAGE_KEY,
            ),
          );

        setProductIds(
          storedFavorites,
        );

        setIsReady(true);
      }, 0);

    return () => {
      window.clearTimeout(
        hydrationTimeout,
      );
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(productIds),
    );
  }, [
    isReady,
    productIds,
  ]);

  const isFavorite = useCallback(
    (productId: string) =>
      productIds.includes(productId),
    [productIds],
  );

  const toggleFavorite = useCallback(
    (productId: string) => {
      setProductIds(
        (currentIds) =>
          currentIds.includes(productId)
            ? currentIds.filter(
                (currentId) =>
                  currentId !==
                  productId,
              )
            : [
                ...currentIds,
                productId,
              ],
      );
    },
    [],
  );

  const removeFavorite = useCallback(
    (productId: string) => {
      setProductIds(
        (currentIds) =>
          currentIds.filter(
            (currentId) =>
              currentId !==
              productId,
          ),
      );
    },
    [],
  );

  const clearFavorites =
    useCallback(() => {
      setProductIds([]);
    }, []);

  const value = useMemo(
    () => ({
      productIds,

      totalFavorites:
        productIds.length,

      isReady,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [
      productIds,
      isReady,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    ],
  );

  return (
    <FavoritesContext.Provider
      value={value}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context =
    useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider.",
    );
  }

  return context;
}