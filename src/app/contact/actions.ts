"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { notificationEmailText } from "@/lib/contactNotification";
import { notifyVero, pingVero, sendEmail } from "@/lib/email";

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

  const notified = await notifyVero({
    fromName: "Site Véronique Chantal",
    replyTo: parsed.data.email,
    subject: `Nouveau message de ${parsed.data.name} (${parsed.data.sessionType})`,
    text: notificationEmailText(parsed.data),
  });
  if (notified) {
    await prisma.contactMessage.update({
      where: { id: created.id },
      data: { notifiedAt: new Date() },
    });
    await pingVero(`${parsed.data.name} a écrit via le formulaire de contact du site.`);
  }

  await sendConfirmationEmail(parsed.data);

  return { status: "success" };
}

async function sendConfirmationEmail(data: z.infer<typeof ContactSchema>) {
  await sendEmail({
    to: data.email,
    fromName: "Véronique Chantal Photographe",
    subject: "Ton message a bien été reçu",
    text: `Bonjour ${data.name},\n\nMerci pour ton message concernant « ${data.sessionType} ». Je te réponds sous 1 à 2 jours.\n\nÀ bientôt,\nVéronique`,
  });
}
