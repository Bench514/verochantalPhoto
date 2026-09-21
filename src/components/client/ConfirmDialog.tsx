"use client";

import { useEffect } from "react";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-dark/70 p-6">
      <div className="absolute inset-0" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-sm bg-bg p-8 text-center">
        <h2 className="font-signature text-3xl leading-none">{title}</h2>
        <p className="mt-4 text-sm leading-[1.6] text-fg-muted">{message}</p>
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-sm border border-border px-4 py-2.5 text-[13px] tracking-[0.03em] text-fg-muted hover:border-fg hover:text-fg"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-sm bg-fg px-4 py-2.5 text-[13px] tracking-[0.03em] text-bg hover:opacity-85"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
