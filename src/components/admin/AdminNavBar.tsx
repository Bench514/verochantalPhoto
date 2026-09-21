"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { logoutAction } from "@/app/admin/actions";

const TABS = [
  { href: "/admin/sessions", label: "Séances" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNavBar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg px-[4vw] py-4">
      <div className="flex items-center gap-8">
        <Link href="/" aria-label="Véro Chantal Photographe — accueil du site" className="inline-flex">
          <Logo shape="monogram" />
        </Link>
        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.08em]">
          {TABS.map((tab) => {
            const active = pathname?.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`pb-1 ${
                  active
                    ? "border-b border-fg text-fg"
                    : "border-b border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-5 text-[13px] text-fg-muted">
        <span>{email}</span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.06em] text-fg hover:bg-fg hover:text-bg"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
