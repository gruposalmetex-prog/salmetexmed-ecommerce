"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { ResolvedFavorites } from "../services/favorites.service";
import { useFavorites } from "../favorites-provider";

const emptyFavorites: ResolvedFavorites = {
  products: [],
  missingProductIds: [],
};

export function useResolvedFavorites() {
  const {
    productIds,
    isReady,
    removeFavorite,
  } = useFavorites();

  const hasProductIds =
    productIds.length > 0;

  const [
    favorites,
    setFavorites,
  ] =
    useState<ResolvedFavorites | null>(
      null,
    );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    requestVersion,
    setRequestVersion,
  ] = useState(0);

  const retry = useCallback(() => {
    setRequestVersion(
      (currentVersion) =>
        currentVersion + 1,
    );
  }, []);

  useEffect(() => {
    if (
      !isReady ||
      !hasProductIds
    ) {
      return;
    }

    const controller =
      new AbortController();

    async function resolve() {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await fetch(
            "/api/favorites/resolve",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                productIds,
              ),

              cache: "no-store",
              signal:
                controller.signal,
            },
          );

        if (!response.ok) {
          throw new Error(
            "No se pudieron consultar tus favoritos.",
          );
        }

        const resolvedFavorites =
          (await response.json()) as ResolvedFavorites;

        if (
          controller.signal.aborted
        ) {
          return;
        }

        setFavorites(
          resolvedFavorites,
        );

        for (
          const productId of
          resolvedFavorites.missingProductIds
        ) {
          removeFavorite(productId);
        }
      } catch (requestError) {
        if (
          requestError instanceof
            Error &&
          requestError.name ===
            "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof
            Error
            ? requestError.message
            : "No se pudieron consultar tus favoritos.",
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
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
    hasProductIds,
    productIds,
    requestVersion,
    removeFavorite,
  ]);

  return {
    favorites:
      isReady && !hasProductIds
        ? emptyFavorites
        : favorites,

    error:
      isReady && !hasProductIds
        ? null
        : error,

    isLoading:
      isReady && hasProductIds
        ? isLoading
        : false,

    retry,
  };
}