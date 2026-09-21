import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import type { SessionPhotoDTO } from "@/lib/types";
import SelectablePhoto from "@/components/client/SelectablePhoto";
import SubmitSelectionButton from "@/components/client/SubmitSelectionButton";

export default async function ClientSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userId = await getClientUserId();

  // Ownership check happens here, server-side, from the session cookie —
  // not from anything in the URL. A client can never view another
  // client's session by guessing this id.
  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: { photos: { orderBy: { createdAt: "asc" } } },
  });
  if (!session || session.clientId !== userId) notFound();

  const expired = !!session.expiresAt && session.expiresAt < new Date();
  if (expired) {
    return (
      <div>
        <h1 className="text-2xl">{session.title}</h1>
        <p className="mt-4 text-sm text-fg-muted">
          L&rsquo;accès à cette séance a expiré. Contactez Véronique si vous avez besoin d&rsquo;y
          accéder à nouveau.
        </p>
      </div>
    );
  }

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
      <p className="mt-1 text-sm text-fg-muted">
        {locked
          ? `Sélection soumise — ${selectedCount} photo(s) retenue(s).`
          : "Cliquez sur les photos que vous retenez, puis soumettez votre sélection."}
      </p>

      {photos.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Aucune photo n&rsquo;a encore été ajoutée.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <SelectablePhoto
                key={photo.id}
                photo={photo}
                sessionId={session.id}
                locked={locked}
              />
            ))}
          </div>

          {!locked && (
            <div className="mt-8">
              <SubmitSelectionButton sessionId={session.id} selectedCount={selectedCount} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
