import type {
    Metadata,
  } from "next";
  import type {
    ReactNode,
  } from "react";

  export const metadata: Metadata = {
    title: {
      default:
        "Administración | SALMETEXMED",
      template:
        "%s | Administración | SALMETEXMED",
    },

    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };

  interface AdminLayoutProps {
    children: ReactNode;
  }

  export default function AdminLayout({
    children,
  }: AdminLayoutProps) {
    return children;
  }