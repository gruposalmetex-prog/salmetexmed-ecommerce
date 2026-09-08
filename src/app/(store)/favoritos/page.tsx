import type { Metadata } from "next";

import { FavoritesView } from "@/features/favorites/components/favorites-view";

export const metadata: Metadata = {
  title: "Favoritos | SALMETEXMED",
  description:
    "Consulta los productos médicos que guardaste como favoritos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesPage() {
  return <FavoritesView />;
}