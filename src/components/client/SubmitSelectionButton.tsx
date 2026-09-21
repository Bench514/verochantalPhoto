"use client";

import { useState, useTransition } from "react";
import { submitSelectionAction } from "@/app/client/(dashboard)/[sessionId]/actions";

export default function SubmitSelectionButton({
  sessionId,
  selectedCount,
}: {
  sessionId: string;
  selectedCount: number;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (selectedCount === 0) {
      setError("Sélectionnez au moins une photo avant de soumettre.");
      return;
    }
    if (
      !confirm(
        `Soumettre ${selectedCount} photo(s) sélectionnée(s) ? Cette action est définitive — vous ne pourrez plus modifier votre choix après.`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await submitSelectionAction(sessionId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="rounded-sm bg-fg px-6 py-3 text-[13px] tracking-[0.03em] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Envoi..." : `Soumettre ma sélection (${selectedCount})`}
      </button>
      {error && <p className="mt-2 text-sm text-fg-muted">{error}</p>}
    </div>
  );
}
