"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function toggleReadAction(id: string, read: boolean) {
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function resendNotificationAction(id: string) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

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
        reply_to: message.email,
        subject: `Nouveau message de ${message.name} (${message.sessionType})`,
        text: message.message,
      }),
    });
    if (res.ok) {
      await prisma.contactMessage.update({
        where: { id },
        data: { notifiedAt: new Date() },
      });
    } else {
      console.error("[contact] resend notification rejected:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[contact] resend notification failed:", err);
  }

  revalidatePath("/admin/messages");
}
