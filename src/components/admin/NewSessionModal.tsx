"use client";

import { useEffect, useState } from "react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import NewSessionForm from "./NewSessionForm";

export default function NewSessionModal() {
  const [open, setOpen] = useState(false);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm bg-fg px-5 py-2.5 text-[13px] tracking-[0.03em] text-bg hover:opacity-85"
      >
        + Créer
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-session-title"
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-dark/70 p-6"
        >
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
          <div className="relative my-auto w-full max-w-[640px] rounded-sm bg-bg p-6 sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id="new-session-title" className="font-signature text-3xl leading-none">
                Nouvelle galerie
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="-mr-2 -mt-2 px-2 py-1 text-xl leading-none text-fg-muted hover:text-fg"
              >
                ×
              </button>
            </div>
            <NewSessionForm />
          </div>
        </div>
      )}
    </>
  );
}
