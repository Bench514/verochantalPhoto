import { CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/site";

// Toutes les communications complètes (formulaire de contact, soumission de
// galerie client) atterrissent dans cette boîte réelle. Le Gmail personnel de
// Véro (VERO_PING_EMAIL) ne reçoit qu'un rappel ponctuel, jamais le contenu.
const NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || CONTACT_EMAIL;

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  fromName?: string;
};

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
  fromName = "Véronique Chantal Photographie",
}: SendEmailArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${CONTACT_EMAIL}>`,
        to,
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[email] send rejected:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

/** Envoie le courriel complet à la boîte info@ — la seule destination du contenu. */
export function notifyVero(args: Omit<SendEmailArgs, "to">): Promise<boolean> {
  return sendEmail({ ...args, to: NOTIFICATION_EMAIL });
}

/**
 * Prévient Véro sur son Gmail personnel sans jamais y mettre le contenu —
 * seulement un rappel d'aller consulter info@. No-op si VERO_PING_EMAIL
 * n'est pas configuré (ex. tant que Véro n'a pas de Gmail perso dédié à ça).
 */
export async function pingVero(reason: string) {
  const to = process.env.VERO_PING_EMAIL;
  if (!to) return;

  await sendEmail({
    to,
    subject: `Nouvelle communication sur ${SITE_DOMAIN}`,
    text: `${reason}\n\nVa consulter ${CONTACT_EMAIL} pour les détails.`,
  });
}
