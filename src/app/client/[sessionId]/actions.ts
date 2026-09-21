"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import { isSessionLocked } from "@/lib/types";

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
  await requireOwnedPendingSession(sessionId);

  await prisma.photoSession.update({
    where: { id: sessionId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });

  revalidateSession(sessionId);
  redirect(`/client/${sessionId}`);
}
