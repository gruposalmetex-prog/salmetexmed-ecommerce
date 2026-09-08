"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export function AdminSignOutButton() {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await authClient.signOut();

      router.replace(
        "/admin/iniciar-sesion",
      );

      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSigningOut ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      <span className="hidden sm:inline">
        {isSigningOut
          ? "Saliendo..."
          : "Cerrar sesión"}
      </span>
    </button>
  );
}