import { ContactView } from "@/components/contact/components/contact-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto y cotizaciones | SALMETEXMED",
  description:
    "Contacta a SALMETEXMED para solicitar información, disponibilidad y cotizaciones de equipo médico.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactPage() {
  return <ContactView />;
}
