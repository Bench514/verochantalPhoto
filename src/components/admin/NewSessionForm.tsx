"use client";

import { useActionState } from "react";
import { createSessionAction, type CreateSessionState } from "@/app/admin/(dashboard)/sessions/actions";
import { EXPIRY_PRESETS } from "@/lib/types";

const inputClass =
  "w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-fg outline-none focus:border-fg";

export default function NewSessionForm() {
  const [state, formAction, pending] = useActionState<CreateSessionState, FormData>(
    createSessionAction,
    {}
  );

  return (
    <form action={formAction} className="mt-8 space-y-4 rounded-sm bg-bg-alt p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="title">
            Titre de la séance
          </label>
          <input id="title" name="title" type="text" required className={inputClass} />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="email">
            Courriel du client
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
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
