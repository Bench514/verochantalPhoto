import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionEmail } from "@/lib/auth";
import { logoutAction } from "../actions";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/admin/photos" className="hover:text-fg-muted">
            Photos
          </Link>
          <Link href="/admin/sessions" className="hover:text-fg-muted">
            Séances
          </Link>
          <Link href="/admin/messages" className="hover:text-fg-muted">
            Messages
          </Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-fg-muted hover:text-fg">
            Déconnexion ({email})
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-[1000px] px-6 py-10">{children}</main>
    </div>
  );
}
