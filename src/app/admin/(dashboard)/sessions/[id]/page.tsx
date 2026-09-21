import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { SessionPhotoDTO } from "@/lib/types";
import { deleteSessionAction } from "../actions";
import InviteLinkButton from "@/components/admin/InviteLinkButton";
import SessionPhotoUploadForm from "@/components/admin/SessionPhotoUploadForm";
import SessionPhotoRow from "@/components/admin/SessionPhotoRow";

export default async function AdminSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await prisma.photoSession.findUnique({
    where: { id },
    include: { client: true, photos: { orderBy: { createdAt: "asc" } } },
  });
  if (!session) notFound();

  const photos: SessionPhotoDTO[] = session.photos.map((p) => ({
    id: p.id,
    filename: p.filename,
    sizeBytes: p.sizeBytes,
    selected: p.selected,
  }));
  const locked = session.status === "SUBMITTED";
  const selectedCount = photos.filter((p) => p.selected).length;

  return (
    <div>
      <h1 className="text-2xl">{session.title}</h1>
      <p className="mt-1 text-sm text-fg-muted">{session.client.email}</p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-fg-muted">
        <span>Statut : {locked ? `Soumise (${selectedCount} sélectionnée(s))` : "En attente"}</span>
        {session.expiresAt && (
          <span>
            Accès expire le{" "}
            {session.expiresAt.toLocaleDateString("fr-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <InviteLinkButton sessionId={session.id} hasPassword={!!session.client.passwordHash} />
        <form action={deleteSessionAction.bind(null, session.id)}>
          <button
            type="submit"
            className="rounded-sm border border-border px-4 py-2 text-[13px] hover:bg-fg hover:text-bg"
          >
            Supprimer la séance
          </button>
        </form>
      </div>

      {!locked && <SessionPhotoUploadForm sessionId={session.id} />}

      <div className="mt-8">
        {photos.length === 0 ? (
          <p className="text-sm text-fg-muted">Aucune photo pour l&rsquo;instant.</p>
        ) : (
          photos.map((photo) => (
            <SessionPhotoRow key={photo.id} photo={photo} sessionId={session.id} locked={locked} />
          ))
        )}
      </div>
    </div>
  );
}
