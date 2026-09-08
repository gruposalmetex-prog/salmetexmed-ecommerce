"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { useProductSearchSuggestions } from "@/features/catalog/hooks/use-product-search-suggestions";
import { SearchSuggestionsPanel } from "./search-suggestions-panel";

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
}

export function SearchBox({
  className,
  placeholder = "Buscar equipos, marcas o categorías...",
}: SearchBoxProps) {
  const router = useRouter();

  const listId = useId();

  const containerRef = useRef<HTMLFormElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const { suggestions, isLoading, error } = useProductSearchSuggestions(query);

  const normalizedQuery = query.trim();

  const shouldShowPanel = isOpen && normalizedQuery.length >= 2;

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      const target = event.target as Node;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, []);

  function closeSuggestions() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function clearSearch() {
    setQuery("");
    closeSuggestions();
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      closeSuggestions();
      return;
    }

    if (suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);

      setActiveIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);

      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
      );

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const suggestion = suggestions[activeIndex];

      closeSuggestions();

      router.push(`/productos/${suggestion.slug}`);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (normalizedQuery.length < 2) {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }

    closeSuggestions();
  }

  return (
    <form
      ref={containerRef}
      action="/productos"
      method="get"
      role="search"
      onSubmit={handleSubmit}
      className={`relative ${className ?? ""}`}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Buscar productos
      </label>

      <input
        ref={inputRef}
        id={`${listId}-input`}
        type="search"
        name="search"
        value={query}
        required
        minLength={2}
        maxLength={100}
        autoComplete="off"
        placeholder={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={shouldShowPanel}
        aria-controls={shouldShowPanel ? listId : undefined}
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="search-input h-11 w-full rounded-lg border border-slate-300 bg-white pl-4 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
      />

      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Limpiar búsqueda"
          className="absolute cursor-pointer right-11 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-sky-700 text-white transition hover:bg-sky-800"
      >
        <Search className="h-4 w-4" />
      </button>

      {shouldShowPanel && (
        <SearchSuggestionsPanel
          query={query}
          suggestions={suggestions}
          activeIndex={activeIndex}
          isLoading={isLoading}
          error={error}
          listId={listId}
          onActiveIndexChange={setActiveIndex}
          onNavigate={closeSuggestions}
        />
      )}
    </form>
  );
}
