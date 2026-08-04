import Link from "next/link";
import { NAV_LINKS, type NavKey } from "@/lib/nav";

export default function SiteNav({
  active,
  transparent = false,
}: {
  active: NavKey;
  transparent?: boolean;
}) {
  return (
    <nav
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[5vw] py-5"
          : "flex items-center justify-between border-b border-border bg-bg px-[5vw] py-5"
      }
    >
      <Link
        href="/"
        className={
          "font-signature text-2xl " +
          (transparent ? "text-on-dark drop-shadow-sm" : "text-fg")
        }
      >
        Véronique Chantal
      </Link>
      <ul className="flex items-center gap-7 text-[13px] tracking-[0.04em]">
        {NAV_LINKS.map((link) => {
          const isActive = link.key === active;
          const base = transparent
            ? isActive
              ? "text-on-dark font-semibold"
              : "text-on-dark/90"
            : isActive
              ? "text-accent"
              : "text-fg-muted";
          return (
            <li key={link.key}>
              <Link
                href={link.href}
                className={
                  base +
                  (isActive
                    ? " border-b pb-0.5 " +
                      (transparent ? "border-on-dark" : "border-accent")
                    : "")
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
