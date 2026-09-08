"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Check,
  Share2,
} from "lucide-react";

interface ProductShareProps {
  productName: string;
  shortDescription: string | null;
}

export function ProductShare({
  productName,
  shortDescription,
}: ProductShareProps) {
  const [copied, setCopied] =
    useState(false);

  const timeoutRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(
          timeoutRef.current,
        );
      }
    };
  }, []);

  async function copyCurrentUrl() {
    await navigator.clipboard.writeText(
      window.location.href,
    );

    setCopied(true);

    timeoutRef.current =
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text:
            shortDescription ??
            `Conoce ${productName} en SALMETEXMED.`,
          url: window.location.href,
        });

        return;
      }

      await copyCurrentUrl();
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return;
      }

      try {
        await copyCurrentUrl();
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <section
      aria-label="Compartir producto"
      className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Compartir producto
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          Envía esta ficha a otra persona.
        </p>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
          copied
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Enlace copiado
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            Compartir
          </>
        )}
      </button>
    </section>
  );
}