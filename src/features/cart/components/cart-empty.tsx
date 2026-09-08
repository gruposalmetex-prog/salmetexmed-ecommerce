import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="flex min-h-120 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <ShoppingBag className="h-7 w-7 text-sky-700" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-slate-950">
        Tu carrito está vacío
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Explora nuestro catálogo y agrega el
        equipo médico que necesitas.
      </p>

      <Link
        href="/productos"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
      >
        Explorar productos
      </Link>
    </div>
  );
}