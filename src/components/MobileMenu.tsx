"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV_LINKS, type NavKey } from "@/lib/nav";

// Menu burger affiché sous le breakpoint md : le bouton remplace la liste de
// liens du header, et ouvre un panneau plein écran sur fond clair.
export default function MobileMenu({
  active,
  transparent = false,
}: {
  active: NavKey;
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      // Rend le focus au bouton burger seulement après une fermeture, pas au
      // premier rendu.
      if (wasOpen.current) openButtonRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Si l'écran passe en desktop menu ouvert (rotation, redimensionnement),
  // on le referme pour ne pas laisser le scroll bloqué.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const bar =
    "block h-px w-6 " + (transparent ? "bg-on-dark" : "bg-fg");

  return (
    <div className="md:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={
          "-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[7px] focus-visible:outline focus-visible:outline-2 " +
          (transparent ? "outline-on-dark drop-shadow-sm" : "outline-fg")
        }
      >
        <span className={bar} />
        <span className={bar} />
        <span className={bar} />
      </button>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg"
      >
        <div className="flex items-center justify-between px-[5vw] py-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Véro Chantal Photographe, accueil"
            className="inline-flex outline-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <Logo shape="monogram" variant="3a" size={22} />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="relative -mr-2 flex h-11 w-11 items-center justify-center outline-fg focus-visible:outline focus-visible:outline-2"
          >
            <span className="absolute block h-px w-6 rotate-45 bg-fg" />
            <span className="absolute block h-px w-6 -rotate-45 bg-fg" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center px-[5vw] pb-16">
          <ul className="flex flex-col items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = link.key === active;
              return (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      "font-name text-[34px] italic font-light leading-none transition-opacity duration-[180ms] hover:opacity-70 " +
                      (isActive
                        ? "border-b border-accent pb-1 text-accent"
                        : "text-fg")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
