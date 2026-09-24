"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  email: z.string().trim().email("Courriel invalide"),
  sessionType: z.string().trim().min(1, "Type de séance requis"),
  message: z.string().trim().min(1, "Message requis"),
});

export type ContactState = { status: "idle" | "success" | "error"; error?: string };

// Au-delà de ce nombre de messages pour le même courriel en moins de
// RATE_LIMIT_WINDOW_MS, on refuse silencieusement — assez généreux pour un
// humain qui retente après une faute de frappe, assez bas pour freiner un bot.
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export async function submitContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot : champ caché en CSS qu'un humain ne voit ni ne remplit jamais.
  // Un bot qui le remplit reçoit un faux succès, sans écriture ni notification.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    sessionType: formData.get("sessionType"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const recentCount = await prisma.contactMessage.count({
    where: {
      email: parsed.data.email,
      createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
    },
  });
  if (recentCount >= RATE_LIMIT_MAX) {
    return {
      status: "error",
      error: "Trop de messages envoyés récemment. Réessaie dans quelques minutes.",
    };
  }

  const created = await prisma.contactMessage.create({ data: parsed.data });
  const notified = await notifyByEmail(parsed.data);
  if (notified) {
    await prisma.contactMessage.update({
      where: { id: created.id },
      data: { notifiedAt: new Date() },
    });
  }
  await sendConfirmationEmail(parsed.data);

  return { status: "success" };
}

async function notifyByEmail(data: z.infer<typeof ContactSchema>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Site Véronique Chantal <onboarding@resend.dev>",
        to,
        reply_to: data.email,
        subject: `Nouveau message de ${data.name} (${data.sessionType})`,
        text: data.message,
      }),
    });
    if (!res.ok) {
      console.error("[contact] notification email rejected:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    // Le message est déjà enregistré en base — un échec d'envoi d'email ne
    // doit ni le faire perdre ni bloquer la réponse au client. `notifiedAt`
    // reste vide, ce qui permet de le renvoyer depuis l'admin.
    console.error("[contact] notification email failed:", err);
    return false;
  }
}

async function sendConfirmationEmail(data: z.infer<typeof ContactSchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Véronique Chantal Photographe <onboarding@resend.dev>",
        to: data.email,
        subject: "Ton message a bien été reçu",
        text: `Bonjour ${data.name},\n\nMerci pour ton message concernant « ${data.sessionType} ». Je te réponds sous 1 à 2 jours.\n\nÀ bientôt,\nVéronique`,
      }),
    });
  } catch (err) {
    console.error("[contact] confirmation email failed:", err);
  }
}
