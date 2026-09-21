import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getClientUserId } from "@/lib/auth";

export default async function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const userId = await getClientUserId();
  if (!userId) redirect("/client/login");
  return <>{children}</>;
}
