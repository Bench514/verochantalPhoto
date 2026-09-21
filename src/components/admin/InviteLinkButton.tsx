"use client";

import { useActionState } from "react";
import {
  generateInviteLinkAction,
  type InviteLinkState,
} from "@/app/admin/(dashboard)/sessions/actions";

export default function InviteLinkButton({
  sessionId,
  hasPassword,
}: {
  sessionId: string;
  hasPassword: boolean;
}) {
  const [state, formAction, pending] = useActionState<InviteLinkState, FormData>(
    generateInviteLinkAction,
    {}
  );

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="sessionId" value={sessionId} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm border border-border px-4 py-2 text-[13px] hover:border-fg disabled:opacity-50"
        >
          {pending
            ? "Génération..."
            : hasPassword
              ? "Réinitialiser l'accès (mot de passe oublié / renvoyer le lien)"
              : "Générer un lien d'invitation"}
        </button>
      </form>
      {state.error && <p className="mt-2 text-sm text-fg-muted">{state.error}</p>}
      {state.link && (
        <>
          <p className="mt-2 break-all rounded-sm bg-bg-alt p-3 text-xs">{state.link}</p>
          {hasPassword && (
            <p className="mt-1 text-xs text-fg-muted">
              Ouvrir ce lien remplacera le mot de passe actuel du client.
            </p>
          )}
        </>
      )}
    </div>
  );
}
