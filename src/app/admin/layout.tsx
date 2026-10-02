import type { Metadata } from "next";

// Espace privé : jamais indexé par les moteurs de recherche (robots.ts
// en interdit aussi l'exploration).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
