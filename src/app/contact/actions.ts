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

export async function submitContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    sessionType: formData.get("sessionType"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  await notifyByEmail(parsed.data);

  return { status: "success" };
}

async function notifyByEmail(data: z.infer<typeof ContactSchema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch("https://api.resend.com/emails", {
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
  } catch (err) {
    // Le message est déjà enregistré en base — un échec d'envoi d'email ne
    // doit ni le faire perdre ni bloquer la réponse au client.
    console.error("[contact] notification email failed:", err);
  }
}
