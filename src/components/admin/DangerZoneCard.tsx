"use client";

import { useState } from "react";
import { deleteSessionAction } from "@/app/admin/(dashboard)/sessions/actions";

export default function DangerZoneCard({
  sessionId,
  sessionTitle,
}: {
  sessionId: string;
  sessionTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const action = deleteSessionAction.bind(null, sessionId);
  const matches = confirmText.trim() === sessionTitle;

  return (
    <div className="rounded-sm border border-border p-[22px]">
      <div className="mb-1.5 text-[13px]">Zone sensible</div>
      <p className="mb-4 text-xs leading-[1.55] text-fg-muted">
        Supprimer la séance retire définitivement ses photos, la sélection du client et l&rsquo;accès
        associé. Cette action est irréversible.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-sm border border-fg px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-fg"
        >
          Supprimer la séance
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-fg-muted">
            Tapez <span className="text-fg">{sessionTitle}</span> pour confirmer.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoFocus
            className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-fg"
          />
          <div className="flex gap-2">
            <form action={action} className="flex-1">
              <button
                type="submit"
                disabled={!matches}
                className="w-full rounded-sm border border-fg bg-fg px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-bg disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirmer la suppression
              </button>
            </form>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmText("");
              }}
              className="flex-1 rounded-sm border border-border px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-fg-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
