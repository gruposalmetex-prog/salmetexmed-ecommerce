import type { ComponentType } from "react";
import Link from "next/link";
import {
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  FaCcAmex,
  FaCcMastercard,
  FaCcVisa,
} from "react-icons/fa";

import { formatPrice } from "../utils/format-price";

interface CartSummaryProps {
  totalItems: number;
  subtotalInCents: number;
}

export function CartSummary({
  totalItems,
  subtotalInCents,
}: CartSummaryProps) {
  return (
    <aside>
      <div className="sticky top-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Resumen de compra
        </h2>

        <div className="mt-6 space-y-4">
          <SummaryRow
            label={`Subtotal (${totalItems} ${
              totalItems === 1
                ? "producto"
                : "productos"
            })`}
            value={formatPrice(
              subtotalInCents,
            )}
          />

          <SummaryRow
            label="Envío"
            value="A acordar"
          />

          <SummaryRow
            label="Impuestos"
            value="Calculados al finalizar"
          />
        </div>

        <div className="my-6 border-t border-slate-200" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-950">
              Total estimado
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Envío e impuestos pueden variar.
            </p>
          </div>

          <span className="text-xl font-semibold tracking-tight text-slate-950">
            {formatPrice(
              subtotalInCents,
            )}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          Continuar compra
        </Link>

        <PaymentMethods />

        <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
          <TrustItem
            icon={ShieldCheck}
            title="Compra segura"
            description="Protección durante tu proceso de compra."
          />

          <TrustItem
            icon={Truck}
            title="Envíos a todo México"
            description="Calculamos la mejor opción de entrega."
          />

          <TrustItem
            icon={PackageCheck}
            title="Existencias verificadas"
            description="Validamos disponibilidad antes del envío."
          />
        </div>
      </div>
    </aside>
  );
}

function PaymentMethods() {
  return (
    <div className="mt-5 border-t border-slate-200 pt-5">
      <p className="text-center text-xs font-medium text-slate-500">
        Métodos de pago aceptados
      </p>

      <div className="mt-3 flex items-center justify-center gap-4">
        <FaCcAmex
          role="img"
          className="h-8 w-10 text-[#006FCF]"
          aria-label="American Express"
        />

        <FaCcMastercard
          role="img"
          className="h-8 w-10 text-[#EB001B]"
          aria-label="Mastercard"
        />

        <FaCcVisa
          role="img"
          className="h-8 w-10 text-[#1434CB]"
          aria-label="Visa"
        />
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        El costo y las condiciones de envío se
        acordarán al realizar la compra.
      </p>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({
  label,
  value,
}: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="text-right font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

interface TrustItemProps {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}

function TrustItem({
  icon: Icon,
  title,
  description,
}: TrustItemProps) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}