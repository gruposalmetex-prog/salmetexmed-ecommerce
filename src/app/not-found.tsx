import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { CartProvider } from "@/features/cart/components/cart-provider";
import { FavoritesProvider } from "@/features/favorites/favorites-provider";

import Link from "next/link";
import { ArrowRight, Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <div className="flex flex-1 flex-col">
            <main className="relative isolate flex min-h-[75vh] items-center overflow-hidden bg-white">
              <div aria-hidden className="absolute inset-0 -z-10">
                <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />

                <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[40px_40px] opacity-25" />
              </div>

              <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
                <section>
                  <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Error 404
                  </span>

                  <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    No encontramos la página que buscas
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Es posible que la dirección haya cambiado, que el producto
                    ya no esté disponible o que el enlace sea incorrecto.
                  </p>

                  <form
                    action="/productos"
                    method="get"
                    className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
                  >
                    <label htmlFor="not-found-search" className="sr-only">
                      Buscar productos
                    </label>

                    <div className="relative min-w-0 flex-1">
                      <Search
                        aria-hidden
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="not-found-search"
                        name="search"
                        type="search"
                        placeholder="Buscar equipo médico..."
                        className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-600/20"
                    >
                      Buscar
                      <ArrowRight aria-hidden className="h-4 w-4" />
                    </button>
                  </form>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                    >
                      <Home aria-hidden className="h-4 w-4" />
                      Volver al inicio
                    </Link>

                    <Link
                      href="/productos"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                    >
                      <ShoppingBag aria-hidden className="h-4 w-4" />
                      Ver catálogo
                    </Link>
                  </div>

                  <p className="mt-8 text-sm text-slate-500">
                    ¿Necesitas ayuda?{" "}
                    <Link
                      href="/contacto"
                      className="font-semibold text-sky-700 underline-offset-4 transition hover:text-sky-900 hover:underline"
                    >
                      Ponte en contacto con nosotros
                    </Link>
                    .
                  </p>
                </section>

                <div
                  aria-hidden
                  className="relative mx-auto flex w-full max-w-md items-center justify-center"
                >
                  <div className="absolute h-72 w-72 rounded-full border border-sky-200 bg-sky-50/80 sm:h-80 sm:w-80" />

                  <div className="absolute h-56 w-56 rounded-full border border-dashed border-sky-300 sm:h-64 sm:w-64" />

                  <div className="relative flex h-48 w-48 flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-sky-900/10 sm:h-56 sm:w-56">
                    <span className="text-7xl font-bold tracking-tighter text-sky-700 sm:text-8xl">
                      404
                    </span>

                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span className="h-px w-8 bg-slate-300" />
                      Página no encontrada
                      <span className="h-px w-8 bg-slate-300" />
                    </div>
                  </div>

                  <div className="absolute right-4 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-3xl font-light text-white shadow-lg shadow-blue-700/25 sm:right-0">
                    +
                  </div>

                  <div className="absolute bottom-4 left-6 h-8 w-8 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30 sm:left-0" />
                </div>
              </div>
            </main>
          </div>

          <Footer />
          <WhatsAppFloat />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
