import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  ShoppingBag,
} from "lucide-react";

export function CheckoutView() {
  return (
    <main className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="transition hover:text-sky-700"
          >
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <Link
            href="/carrito"
            className="transition hover:text-sky-700"
          >
            Carrito
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span
            aria-current="page"
            className="font-medium text-slate-800"
          >
            Finalizar compra
          </span>
        </nav>

        <section className="flex min-h-145 items-center justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <Clock3 className="h-9 w-9 text-sky-700" />
            </div>

            <span className="mt-8 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Próximamente
            </span>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Estamos preparando nuestro
              proceso de compra
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-600">
              Muy pronto podrás finalizar tus
              pedidos directamente desde
              SALMETEXMED. Estamos trabajando
              para ofrecerte un proceso seguro,
              claro y confiable.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Los productos de tu carrito
              permanecerán guardados en este
              navegador mientras continúas
              explorando el catálogo.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/carrito"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al carrito
              </Link>

              <Link
                href="/productos"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                <ShoppingBag className="h-4 w-4" />
                Explorar productos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}