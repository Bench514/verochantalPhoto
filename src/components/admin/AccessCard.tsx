"use client";

import { useState, useTransition } from "react";
import { generateInviteLinkAction } from "@/app/admin/(dashboard)/sessions/actions";
import Spinner from "./Spinner";

export default function AccessCard({
  sessionId,
  initialLink,
  initialExpiresAt,
}: {
  sessionId: string;
  initialLink: string | null;
  initialExpiresAt: string | null;
}) {
  const [link, setLink] = useState(initialLink);
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function generate() {
    setError(null);
    setCopied(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("sessionId", sessionId);
      const result = await generateInviteLinkAction({}, formData);
      if (result.error) setError(result.error);
      else {
        setLink(result.link ?? null);
        setExpiresAt(result.expiresAt ?? null);
      }
    });
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Impossible de copier — copiez le lien manuellement.");
    }
  }

  const expiresLabel = expiresAt
    ? new Date(expiresAt).toLocaleDateString("fr-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="rounded-sm border border-border bg-card p-[22px]">
      <div className="mb-3 text-[13px]">Accès client</div>
      <p className="mb-3 text-[13px] leading-[1.55] text-fg-muted">
        Ce lien sert à créer le mot de passe. Le client se connecte ensuite normalement sur{" "}
        <span className="text-fg">/client/login</span>.
      </p>

      <div className="mb-1.5 break-all rounded-sm border border-border bg-bg px-3 py-2.5 text-xs text-fg-muted">
        {link || "Aucun lien de mot de passe actif"}
      </div>
      {expiresLabel && (
        <p className="mb-3 text-[11px] text-fg-muted">Expire le {expiresLabel}.</p>
      )}
      {!expiresLabel && <div className="mb-3" />}

      {error && <p className="mb-3 text-xs text-fg-muted">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={generate}
          className="inline-flex min-w-[130px] flex-1 items-center justify-center gap-2 rounded-sm bg-fg px-3.5 py-2.5 text-[11px] uppercase tracking-[0.06em] text-bg disabled:opacity-60"
        >
          {pending && <Spinner />}
          Générer un lien
        </button>
        <button
          type="button"
          disabled={!link}
          onClick={copy}
          className="min-w-[130px] flex-1 rounded-sm border px-3.5 py-2.5 text-[11px] uppercase tracking-[0.06em] disabled:cursor-default disabled:border-border disabled:text-fg-disabled border-fg text-fg"
        >
          {copied ? "Copié" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
