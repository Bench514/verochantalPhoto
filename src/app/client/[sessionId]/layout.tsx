import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getClientUserId } from "@/lib/auth";

// No shared chrome here on purpose — the Espace Client and Galerie Client
// screens each own their full header/hero layout (design handoff), unlike
// the generic session list at /client which keeps the plain dashboard shell.
export default async function ClientSessionLayout({ children }: { children: ReactNode }) {
  const userId = await getClientUserId();
  if (!userId) redirect("/client/login");
  return <>{children}</>;
}
