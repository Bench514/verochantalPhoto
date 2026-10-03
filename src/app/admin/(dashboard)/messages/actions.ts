"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { notificationEmailText } from "@/lib/contactNotification";
import { notifyVero, pingVero } from "@/lib/email";

export async function toggleReadAction(id: string, read: boolean) {
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function resendNotificationAction(id: string) {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return;

  const notified = await notifyVero({
    fromName: "Site Véronique Chantal",
    replyTo: message.email,
    subject: `Nouveau message de ${message.name} (${message.sessionType})`,
    text: notificationEmailText(message),
  });
  if (notified) {
    await prisma.contactMessage.update({ where: { id }, data: { notifiedAt: new Date() } });
    await pingVero(`${message.name} a écrit via le formulaire de contact du site.`);
  }

  revalidatePath("/admin/messages");
}
