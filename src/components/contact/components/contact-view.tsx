import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./contact-form";

export function ContactView() {
  const { salesEmail, whatsappNumber, phone, locations, businessHours } =
    siteConfig.contact;

  return (
    <main className="w-full bg-slate-50">
      <div className="mx-auto w-full max-w-350 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition hover:text-sky-700">
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 text-slate-300" />

          <span aria-current="page" className="font-medium text-slate-800">
            Contacto
          </span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Estamos para ayudarte
          </span>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Contacta a nuestro equipo
          </h1>

          <p className="mt-4 text-base leading-8 text-slate-600">
            Solicita información sobre productos, disponibilidad, precios,
            cotizaciones y condiciones de entrega.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ContactForm  />

          <aside className="space-y-5">
            {/* Contacto directo */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Contacto directo
              </h2>

              <div className="mt-5 space-y-4">
                {whatsappNumber && (
                  <ContactMethod
                    icon={MessageCircle}
                    label="WhatsApp"
                    value={phone}
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                    external
                  />
                )}

                {salesEmail && (
                  <ContactMethod
                    icon={Mail}
                    label="Correo de ventas"
                    value={salesEmail}
                    href={`mailto:${salesEmail}`}
                  />
                )}

                {phone && (
                  <ContactMethod
                    icon={Phone}
                    label="Teléfono"
                    value={phone}
                    href={`tel:${phone.replace(/\D/g, "")}`}
                  />
                )}
              </div>
            </section>

            {/* Direcciones */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-sky-700" />

                <h2 className="text-lg font-semibold text-slate-950">
                  Direcciones
                </h2>
              </div>

              <div className="mt-5 space-y-5">
                {locations.map((location) => (
                  <div
                    key={location.name}
                    className="border-b border-slate-200 pb-5 last:border-0 last:pb-0"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      {location.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {location.address}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Horarios */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-sky-700" />

                <h2 className="text-lg font-semibold text-slate-950">
                  Horarios de atención
                </h2>
              </div>

              <dl className="mt-5 space-y-3">
                {businessHours.map((schedule) => (
                  <div
                    key={schedule.days}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <dt className="text-slate-500">{schedule.days}</dt>

                    <dd className="text-right font-semibold text-slate-900">
                      {schedule.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6">
              <ShieldCheck className="h-6 w-6 text-sky-700" />

              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                Atención especializada
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Nuestro equipo revisará tus necesidades antes de brindarte
                información comercial.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface ContactMethodProps {
    icon: React.ComponentType<{
      className?: string;
    }>;
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }

  function ContactMethod({
    icon: Icon,
    label,
    value,
    href,
    external = false,
  }: ContactMethodProps) {
    return (
      <a
        href={href}
        target={
          external
            ? "_blank"
            : undefined
        }
        rel={
          external
            ? "noopener noreferrer"
            : undefined
        }
        className="flex items-center gap-3 rounded-xl transition hover:text-sky-700"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50">
          <Icon className="h-5 w-5 text-sky-700" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="wrap-break-word text-sm font-semibold text-slate-900">
            {value}
          </p>
        </div>
      </a>
    );
  }