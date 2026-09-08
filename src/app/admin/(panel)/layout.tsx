import type {
  ReactNode,
} from "react";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { requireAdmin } from "@/features/admin/require-admin";

interface AdminPanelLayoutProps {
  children: ReactNode;
}

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const session = await requireAdmin();

  return (
    <AdminShell
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    >
      {children}
    </AdminShell>
  );
}