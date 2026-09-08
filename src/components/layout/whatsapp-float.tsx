"use client";

import { FaWhatsapp } from "react-icons/fa";

import { siteConfig } from "@/config/site";

const DEFAULT_MESSAGE =
  "Hola, me interesa recibir información sobre equipo médico.";

export function WhatsAppFloat() {
  const whatsappNumber =
    siteConfig.contact.whatsappNumber.replace(/\D/g, "");

  if (!whatsappNumber) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    DEFAULT_MESSAGE,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <FaWhatsapp
        aria-hidden="true"
        className="h-7 w-7"
      />

      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}