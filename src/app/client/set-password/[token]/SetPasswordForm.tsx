"use client";

import { useActionState } from "react";
import { setPasswordAction, type SetPasswordState } from "./actions";

const inputClass =
  "w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-fg outline-none focus:border-fg";

export default function SetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<SetPasswordState, FormData>(
    setPasswordAction.bind(null, token),
    {}
  );

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4 rounded-sm bg-bg-alt p-9">
      <h1 className="font-signature text-3xl">Bienvenue</h1>
      <p className="text-sm text-fg-muted">Choisissez un mot de passe pour accéder à vos photos.</p>
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="confirm">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      {state.error && <p className="text-sm text-fg-muted">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-fg px-6 py-3 text-[13px] tracking-[0.03em] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Créer mon compte"}
      </button>
    </form>
  );
}
