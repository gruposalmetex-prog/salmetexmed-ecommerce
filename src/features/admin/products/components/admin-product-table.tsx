import Link from "next/link";
import Image from "next/image";
import {
  ImageIcon,
  Pencil,
} from "lucide-react";

import type {
  AdminProductListItem,
} from "../services/admin-product.service";

interface AdminProductTableProps {
  products: AdminProductListItem[];
}

const dateFormatter =
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  });

const statusLabels = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
} as const;

const statusClasses = {
  draft:
    "border-amber-200 bg-amber-50 text-amber-700",
  published:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived:
    "border-slate-200 bg-slate-100 text-slate-600",
} as const;

const saleModeLabels = {
  direct_purchase: "Compra directa",
  quote_only: "Cotización",
  contact_only: "Contacto",
} as const;

function getInventoryLabel(
  product: AdminProductListItem,
) {
  if (product.activeVariantCount === 0) {
    return "Sin variantes activas";
  }

  if (
    product.inventory.hasUntrackedVariants
  ) {
    return "Sin control";
  }

  const units =
    product.inventory.stock === 1
      ? "unidad"
      : "unidades";

  return `${product.inventory.stock} ${units}`;
}

export function AdminProductTable({
  products,
}: AdminProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />

        <h2 className="mt-4 font-semibold text-slate-950">
          No encontramos productos
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Modifica los filtros o registra un nuevo producto.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-262.5 border-collapse text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Producto
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estado
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Modalidad
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Variantes
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inventario
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actualización
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acción
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {product.image ? (
                        <Image
                        src={product.image.url}
                        alt={
                          product.image.altText ||
                          product.name
                        }
                        width={product.image.width}
                        height={product.image.height}
                        sizes="56px"
                        className="h-full w-full object-contain p-1"
                      />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-75 truncate font-semibold text-slate-950">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {product.brand?.name ??
                          "Sin marca"}
                      </p>

                      <p className="mt-1 max-w-75 truncate text-xs text-slate-400">
                        /productos/{product.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={[
                      "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                      statusClasses[
                        product.status
                      ],
                    ].join(" ")}
                  >
                    {
                      statusLabels[
                        product.status
                      ]
                    }
                  </span>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-slate-600">
                  {
                    saleModeLabels[
                      product.saleMode
                    ]
                  }
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {product.activeVariantCount} activas
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {product.variantCount} totales
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {getInventoryLabel(product)}
                  </p>

                  {product.inventory.allowsBackorder && (
                    <p className="mt-1 text-xs text-sky-700">
                      Permite pedidos pendientes
                    </p>
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {dateFormatter.format(
                    new Date(
                      product.updatedAt,
                    ),
                  )}
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/productos/${product.id}/editar`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}