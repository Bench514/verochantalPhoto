import Link from "next/link";
import Logo from "@/components/Logo";
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
        aria-label="Véro Chantal Photographe — accueil"
        className={
          "inline-flex transition-opacity duration-[180ms] ease-in-out hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 " +
          (transparent ? "outline-on-dark drop-shadow-sm" : "outline-fg")
        }
      >
        <Logo shape="monogram" variant={transparent ? "3b" : "3a"} size={22} />
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
