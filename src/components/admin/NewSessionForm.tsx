"use client";

import { useActionState, useRef } from "react";
import { createSessionAction, type CreateSessionState } from "@/app/admin/(dashboard)/sessions/actions";
import { EXPIRY_PRESETS } from "@/lib/types";
import { PACKAGES } from "@/lib/packages";

const inputClass =
  "w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-fg outline-none focus:border-fg";

export default function NewSessionForm() {
  const [state, formAction, pending] = useActionState<CreateSessionState, FormData>(
    createSessionAction,
    {}
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const includedCountRef = useRef<HTMLInputElement>(null);

  // Le menu ne fait que pré-remplir titre et retouches incluses — ces deux
  // champs restent éditables pour une entente personnalisée avec Véronique.
  function applyPackage(key: string) {
    const pkg = PACKAGES.find((p) => p.key === key);
    if (!pkg || !titleRef.current || !includedCountRef.current) return;
    titleRef.current.value = pkg.title;
    includedCountRef.current.value = String(pkg.includedCount);
  }

  return (
    <form action={formAction} className="mt-8 space-y-4 rounded-sm bg-bg-alt p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="clientName">
            Nom du client
          </label>
          <input id="clientName" name="clientName" type="text" required className={inputClass} />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="email">
            Courriel du client
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="packagePreset">
            Forfait
          </label>
          <select
            id="packagePreset"
            defaultValue=""
            onChange={(e) => applyPackage(e.target.value)}
            className={inputClass}
          >
            <option value="">Personnalisé…</option>
            {PACKAGES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="title">
            Titre de la séance (forfait)
          </label>
          <input
            ref={titleRef}
            id="title"
            name="title"
            type="text"
            placeholder="Portrait"
            required
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="sessionDate">
            Date de la séance
          </label>
          <input
            id="sessionDate"
            name="sessionDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="includedCount">
            Retouches incluses
          </label>
          <input
            ref={includedCountRef}
            id="includedCount"
            name="includedCount"
            type="number"
            min={1}
            max={200}
            defaultValue={15}
            required
            className={`${inputClass} w-28`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="expiryDays">
            Accès valide
          </label>
          <select id="expiryDays" name="expiryDays" defaultValue="90" className={inputClass}>
            {EXPIRY_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state.error && <p className="text-sm text-fg-muted">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-fg px-5 py-2.5 text-[13px] tracking-[0.03em] text-bg hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Création..." : "Créer la séance"}
      </button>
    </form>
  );
}
