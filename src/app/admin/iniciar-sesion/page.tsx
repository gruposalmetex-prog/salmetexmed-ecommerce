import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";

import { AdminLoginForm } from "@/features/admin/components/admin-login-form";
import { getAdminSession } from "@/features/admin/require-admin";

export const metadata: Metadata = {
  title: "Acceso",

  robots: {
    index: false,
    follow: false,
  },
};

const benefits = [
  {
    icon: PackageSearch,
    title: "Catálogo centralizado",
    description: "Administra productos, variantes, precios e inventario.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso protegido",
    description: "Sesiones seguras y permisos exclusivos para administradores.",
  },
  {
    icon: LockKeyhole,
    title: "Control de publicación",
    description:
      "Trabaja con borradores antes de mostrar cambios en la tienda.",
  },
];

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[minmax(420px,0.9fr)_minmax(520px,1.1fr)]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-12 py-12 text-white lg:flex lg:flex-col xl:px-16">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-sky-600/20 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600">
            <ShieldCheck className="h-6 w-6" />
          </span>

          <div>
            <p className="font-semibold tracking-wide">SALMETEXMED</p>

            <p className="text-xs text-slate-400">Centro de administración</p>
          </div>
        </Link>

        <div className="relative z-10 my-auto max-w-xl py-16">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
            Gestión comercial
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Tu catálogo médico,
            <span className="block text-sky-400">bajo control.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Gestiona el contenido de la tienda desde un espacio seguro,
            organizado y diseñado para la operación diaria.
          </p>

          <div className="mt-10 space-y-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-400">
                    <Icon className="h-5 w-5" />
                  </span>

                  <div>
                    <h2 className="font-semibold text-white">
                      {benefit.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          Acceso exclusivo para personal autorizado.
        </p>
      </section>

      <section className="flex min-h-screen flex-col bg-slate-50">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-sky-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>

          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Conexión segura
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-110">
            <div className="mb-8 lg:hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-700 text-white shadow-lg shadow-sky-700/20">
                <ShieldCheck className="h-6 w-6" />
              </span>
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Administración
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Bienvenido de nuevo
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Ingresa tus credenciales para acceder al panel de SALMETEXMED.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <AdminLoginForm />
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Si no reconoces este acceso, regresa a la tienda y no compartas
              tus credenciales.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
