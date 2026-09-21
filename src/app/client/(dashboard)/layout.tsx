import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import { clientLogoutAction } from "../actions";

export default async function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const userId = await getClientUserId();
  if (!userId) redirect("/client/login");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/client/login");

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-signature text-xl">Mes photos</span>
        <form action={clientLogoutAction}>
          <button type="submit" className="text-sm text-fg-muted hover:text-fg">
            Déconnexion ({user.email})
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-[1000px] px-6 py-10">{children}</main>
    </div>
  );
}
