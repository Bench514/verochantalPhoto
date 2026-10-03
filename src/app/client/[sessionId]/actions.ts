"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import { isSessionLocked } from "@/lib/types";
import { notifyVero, pingVero } from "@/lib/email";

// Every write here re-derives ownership and lock state from the DB using
// the session cookie's userId — never trusts sessionId/photoId alone, and
// never trusts a "submitted" flag the client might claim.
async function requireOwnedPendingSession(sessionId: string) {
  const userId = await getClientUserId();
  if (!userId) throw new Error("Non authentifié.");

  const session = await prisma.photoSession.findUnique({ where: { id: sessionId } });
  if (!session || session.clientId !== userId) throw new Error("Séance introuvable.");
  if (isSessionLocked(session.status)) throw new Error("Cette sélection a déjà été soumise.");
  if (session.expiresAt && session.expiresAt < new Date()) {
    throw new Error("L'accès à cette séance a expiré.");
  }
  return session;
}

function revalidateSession(sessionId: string) {
  revalidatePath(`/client/${sessionId}`);
  revalidatePath(`/client/${sessionId}/galerie`);
}

export async function toggleSelectionAction(
  sessionId: string,
  photoId: string,
  selected: boolean
) {
  await requireOwnedPendingSession(sessionId);

  const photo = await prisma.sessionPhoto.findUnique({ where: { id: photoId } });
  if (!photo || photo.sessionId !== sessionId) throw new Error("Photo introuvable.");

  await prisma.sessionPhoto.update({ where: { id: photoId }, data: { selected } });
  revalidateSession(sessionId);
}

export async function toggleFavoriteAction(
  sessionId: string,
  photoId: string,
  favorite: boolean
) {
  await requireOwnedPendingSession(sessionId);

  const photo = await prisma.sessionPhoto.findUnique({ where: { id: photoId } });
  if (!photo || photo.sessionId !== sessionId) throw new Error("Photo introuvable.");

  await prisma.sessionPhoto.update({ where: { id: photoId }, data: { favorite } });
  revalidateSession(sessionId);
}

export async function clearSelectionAction(sessionId: string) {
  await requireOwnedPendingSession(sessionId);
  await prisma.sessionPhoto.updateMany({ where: { sessionId }, data: { selected: false } });
  revalidateSession(sessionId);
}

export async function clearFavoritesAction(sessionId: string) {
  await requireOwnedPendingSession(sessionId);
  await prisma.sessionPhoto.updateMany({ where: { sessionId }, data: { favorite: false } });
  revalidateSession(sessionId);
}

export async function submitSelectionAction(sessionId: string) {
  const session = await requireOwnedPendingSession(sessionId);

  await prisma.photoSession.update({
    where: { id: sessionId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });

  const [client, selectedCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.clientId } }),
    prisma.sessionPhoto.count({ where: { sessionId, selected: true } }),
  ]);
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

  const notified = await notifyVero({
    fromName: "Site Véronique Chantal",
    subject: `Sélection soumise : ${session.title} (${client?.name ?? "client"})`,
    text: `${client?.name ?? "Un client"} (${client?.email ?? "courriel inconnu"}) a soumis sa sélection finale pour la séance « ${session.title} ».\n\nPhotos sélectionnées : ${selectedCount}\n\nVoir la séance : ${baseUrl}/admin/sessions/${sessionId}`,
  });
  if (notified) {
    await pingVero(`${client?.name ?? "Un client"} a soumis sa sélection pour « ${session.title} ».`);
  }

  revalidateSession(sessionId);
  redirect(`/client/${sessionId}`);
}
