"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-fg outline-none focus:border-fg";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-sm bg-bg-alt p-9 text-center">
        <p>Merci! Ton message a bien été reçu — réponse sous 1 à 2 jours.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-sm bg-bg-alt p-9">
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="name">
          Nom
        </label>
        <input id="name" name="name" type="text" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="email">
          Courriel
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="sessionType">
          Type de séance
        </label>
        <select id="sessionType" name="sessionType" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Choisir...
          </option>
          <option value="Portrait classique">Portrait classique</option>
          <option value="Séance boudoir">Séance boudoir</option>
          <option value="Forfait duo">Forfait duo</option>
          <option value="Je ne sais pas encore">Je ne sais pas encore</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="message">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className={inputClass} />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-fg-muted">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-fg px-6 py-3 text-[13px] tracking-[0.03em] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}
