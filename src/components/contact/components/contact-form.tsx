"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { contactFormSchema } from "@/features/contact/schemas/contact.schema";
import { siteConfig } from "@/config/site";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = contactFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      message: formData.get("message"),
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        ...(fieldErrors.name?.[0] && {
          name: fieldErrors.name[0],
        }),
        ...(fieldErrors.email?.[0] && {
          email: fieldErrors.email[0],
        }),
        ...(fieldErrors.phone?.[0] && {
          phone: fieldErrors.phone[0],
        }),
        ...(fieldErrors.company?.[0] && {
          company: fieldErrors.company[0],
        }),
        ...(fieldErrors.message?.[0] && {
          message: fieldErrors.message[0],
        }),
      });

      setSubmitStatus("idle");
      return;
    }

    const endpoint = siteConfig.contact.formspreeEndpoint;

    if (!endpoint) {
      setErrors({});
      setSubmitStatus("error");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: result.data.name,
          email: result.data.email,
          telefono: result.data.phone,
          empresa: result.data.company || "No especificada",
          mensaje: result.data.message,
          _subject: `Nuevo mensaje de ${result.data.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree rechazó la solicitud.");
      }

      form.reset();
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="mb-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
          <MessageCircle className="h-5 w-5 text-sky-700" />
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
          Solicita información
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Completa tus datos y prepararemos un mensaje para nuestro equipo de
          ventas por WhatsApp.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre completo"
          name="name"
          error={errors.name}
          required
        />

        <Field
          label="Correo electrónico"
          name="email"
          type="email"
          error={errors.email}
          required
        />

        <Field
          label="Teléfono"
          name="phone"
          type="tel"
          error={errors.phone}
          required
        />

        <Field
          label="Empresa o institución"
          name="company"
          error={errors.company}
          optional
        />

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            ¿Cómo podemos ayudarte?
            <span className="ml-1 text-red-500">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={6}
            maxLength={1500}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder="Cuéntanos qué producto, equipo o solución necesitas..."
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
          />

          {errors.message && (
            <p id="message-error" className="mt-1.5 text-xs text-red-600">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full cursor-pointer gap-3 items-center justify-center rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </button>

      <div aria-live="polite">
        {submitStatus === "success" && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Tu mensaje fue enviado correctamente. Nos pondremos en contacto
            contigo lo antes posible.
          </p>
        )}

        {submitStatus === "error" && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            No pudimos enviar tu mensaje. Inténtalo nuevamente o contáctanos
            mediante WhatsApp.
          </p>
        )}
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-slate-500">
        Al continuar se abrirá WhatsApp con el mensaje preparado. Podrás
        revisarlo antes de enviarlo.
      </p>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  optional?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  optional = false,
  required = false,
  min,
  max,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}

        {optional && (
          <span className="ml-1 font-normal text-slate-400">Opcional</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/10"
      />

      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
