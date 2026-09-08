"use client";

import {
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export function AdminLoginForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget,
    );

    const email = String(
      formData.get("email") ?? "",
    )
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") ?? "",
    );

    if (!email || !password) {
      setError(
        "Ingresa tu correo y contraseña.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result =
        await authClient.signIn.email({
          email,
          password,
          rememberMe: true,
        });

      if (result.error) {
        setError(
          "El correo o la contraseña no son correctos.",
        );
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError(
        "No fue posible iniciar sesión. Inténtalo nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Correo electrónico
        </label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          />

          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="administrador@salmetexmed.com.mx"
            required
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Contraseña
        </label>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          />

          <input
            id="admin-password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            required
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-4 focus:ring-sky-600/10 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current,
              )
            }
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 hover:shadow-sky-700/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          <>
            Ingresar al panel
          </>
        )}
      </button>
    </form>
  );
}