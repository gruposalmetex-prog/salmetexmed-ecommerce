import {
    FaCcAmex,
    FaCcMastercard,
    FaCcVisa,
  } from "react-icons/fa";
  import { SiMercadopago } from "react-icons/si";

  export function ProductPaymentMethods() {
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-1">

        <div
          className=" flex flex-wrap items-center gap-2 justify-center"
          aria-label="Métodos de pago aceptados"
        >
            <p className="text-xs font-medium text-slate-500">
          Métodos de pago aceptados
        </p>

          <div className="flex h-9 min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 shadow-sm">
            <SiMercadopago
              role="img"
              aria-label="Mercado Pago"
              className="h-6 w-9 text-[#009EE3]"
            />
          </div>

          <div className="flex h-9 min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 shadow-sm">
            <FaCcMastercard
              role="img"
              aria-label="Mastercard"
              className="h-7 w-9 text-[#EB001B]"
            />
          </div>

          <div className="flex h-9 min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 shadow-sm">
            <FaCcVisa
              role="img"
              aria-label="Visa"
              className="h-7 w-9 text-[#1434CB]"
            />
          </div>

          <div className="flex h-9 min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 shadow-sm">
            <FaCcAmex
              role="img"
              aria-label="American Express"
              className="h-7 w-9 text-[#006FCF]"
            />
          </div>
        </div>
      </div>
    );
  }