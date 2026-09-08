export const siteConfig = {
  name: "SALMETEXMED",

  description:
    "Venta y distribución de equipo médico, mobiliario hospitalario e insumos médicos en México.",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000",

  locale: "es-MX",
  openGraphLocale: "es_MX",
  currency: "MXN",

  contact: {
    salesEmail:
      process.env.NEXT_PUBLIC_SALES_EMAIL ?? "",

    whatsappNumber:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",

    phone:
      process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",

    formspreeEndpoint:
      process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "",

    locations: [
      {
        name: "Melchor Ocampo",
        address:
          "Calle Dolores s/n, local 10, Colonia Visitación, Melchor Ocampo, Estado de México, C.P. 54890.",
      },
      {
        name: "Saltillo",
        address: "Saltillo, Coahuila, México.",
      },
    ],

    businessHours: [
      {
        days: "Lunes - Viernes",
        hours: "8:00 - 11:00",
      },
      {
        days: "Sábado",
        hours: "9:00 - 1:00",
      },
    ],
  },
} as const;

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}