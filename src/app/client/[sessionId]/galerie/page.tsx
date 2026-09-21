import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import { clientLogoutAction } from "../../actions";
import Logo from "@/components/Logo";
import GalleryClient from "@/components/client/GalleryClient";
import type { GalleryPhoto } from "@/components/client/PhotoTile";
import { isSessionLocked } from "@/lib/types";

function daysLeft(expiresAt: Date | null): number | null {
  if (!expiresAt) return null;
  const ms = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export default async function GalerieClientPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userId = await getClientUserId();

  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: { client: true, photos: { orderBy: { createdAt: "asc" } } },
  });
  if (!session || session.clientId !== userId) notFound();

  const expired = !!session.expiresAt && session.expiresAt < new Date();
  const locked = isSessionLocked(session.status) || expired;
  const sessionName = session.client.name || session.client.email;
  const sessionDateLabel = session.sessionDate.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bonjour@veroniquechantalphoto.ca";

  const photos: GalleryPhoto[] = session.photos.map((p, i) => ({
    id: p.id,
    no: String(i + 1).padStart(2, "0"),
    selected: p.selected,
    favorite: p.favorite,
  }));

  return (
    <div className="bg-bg">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg px-[5vw] py-5">
        <div className="flex items-center gap-[22px]">
          <Link
            href={`/client/${session.id}`}
            aria-label="Véro Chantal Photographe — accueil du portail"
            className="inline-flex"
          >
            <Logo shape="monogram" />
          </Link>
          <div className="flex flex-col gap-0.5">
            <div className="font-name text-xl leading-none">{sessionName}</div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-fg-muted">
              Séance du {sessionDateLabel}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-fg-muted">
          <Link href={`/client/${session.id}`} className="text-[11px] uppercase tracking-[0.08em]">
            ← Accueil
          </Link>
          <form action={clientLogoutAction}>
            <button
              type="submit"
              className="rounded-sm border border-border px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-fg hover:bg-fg hover:text-bg"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      {photos.length === 0 ? (
        <div className="mx-auto max-w-[1100px] px-[5vw] py-20 text-center text-sm text-fg-muted">
          Aucune photo n&rsquo;a encore été ajoutée à cette séance.
        </div>
      ) : (
        <GalleryClient
          sessionId={session.id}
          initialPhotos={photos}
          includedCount={session.includedCount}
          daysLeft={daysLeft(session.expiresAt)}
          locked={locked}
          contactEmail={contactEmail}
          mailSubject={`Ma séance du ${sessionDateLabel}`}
        />
      )}
    </div>
  );
}
