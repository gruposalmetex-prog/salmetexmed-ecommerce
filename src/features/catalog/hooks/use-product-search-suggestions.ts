"use client";

import {
  useEffect,
  useState,
} from "react";

import type { PublicProductSearchSuggestion } from "../services/product.service";

interface SuggestionsResponse {
  suggestions:
    PublicProductSearchSuggestion[];
}

export function useProductSearchSuggestions(
  query: string,
) {
  const normalizedQuery =
    query.trim();

  const hasValidQuery =
    normalizedQuery.length >= 2;

  const [suggestions, setSuggestions] =
    useState<
      PublicProductSearchSuggestion[]
    >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!hasValidQuery) {
      return;
    }

    let controller:
      AbortController | null = null;

    const timeout =
      window.setTimeout(
        async () => {
          controller =
            new AbortController();

          setIsLoading(true);
          setError(null);

          try {
            const response =
              await fetch(
                `/api/search/suggestions?q=${encodeURIComponent(
                  normalizedQuery,
                )}`,
                {
                  cache: "no-store",
                  signal:
                    controller.signal,
                },
              );

            if (!response.ok) {
              throw new Error(
                "No se pudieron consultar las sugerencias.",
              );
            }

            const data =
              (await response.json()) as SuggestionsResponse;

            setSuggestions(
              data.suggestions,
            );
          } catch (requestError) {
            if (
              requestError instanceof
                Error &&
              requestError.name ===
                "AbortError"
            ) {
              return;
            }

            setSuggestions([]);

            setError(
              requestError instanceof
                Error
                ? requestError.message
                : "No se pudieron consultar las sugerencias.",
            );
          } finally {
            if (
              controller &&
              !controller.signal.aborted
            ) {
              setIsLoading(false);
            }
          }
        },
        250,
      );

    return () => {
      window.clearTimeout(timeout);
      controller?.abort();
    };
  }, [
    hasValidQuery,
    normalizedQuery,
  ]);

  return {
    suggestions:
      hasValidQuery
        ? suggestions
        : [],

    isLoading:
      hasValidQuery
        ? isLoading
        : false,

    error:
      hasValidQuery
        ? error
        : null,
  };
}