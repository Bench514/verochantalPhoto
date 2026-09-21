import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { findActiveInviteToken } from "@/lib/invite";
import { isSessionLocked, type SessionPhotoDTO } from "@/lib/types";
import StatusSelect from "@/components/admin/StatusSelect";
import AccessCard from "@/components/admin/AccessCard";
import ClientPreviewCard from "@/components/admin/ClientPreviewCard";
import DangerZoneCard from "@/components/admin/DangerZoneCard";
import SessionGridClient from "@/components/admin/SessionGridClient";

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

  const activeToken = await findActiveInviteToken(session.clientId);
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

  const photos: SessionPhotoDTO[] = session.photos.map((p) => ({
    id: p.id,
    filename: p.filename,
    sizeBytes: p.sizeBytes,
    selected: p.selected,
    favorite: p.favorite,
  }));
  const locked = isSessionLocked(session.status);
  const cover = session.photos.find((p) => p.id === session.coverPhotoId) || session.photos[0];

  const sessionDateLabel = session.sessionDate.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const expiresLabel = session.expiresAt
    ? session.expiresAt.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" })
    : "Aucune";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 px-[4vw] pt-9">
        <div>
          <Link
            href="/admin/sessions"
            className="text-[11px] uppercase tracking-[0.08em] text-fg-muted hover:text-fg"
          >
            ← Toutes les séances
          </Link>
          <h1 className="mt-2 font-name text-[clamp(34px,4.4vw,52px)] italic leading-none">
            {session.title}
          </h1>
          <p className="mt-3 text-sm text-fg-muted">
            {session.client.name ? `${session.client.name} · ` : ""}
            {session.client.email}
          </p>
        </div>
        <StatusSelect sessionId={session.id} status={session.status} />
      </div>

      <div className="mx-[4vw] mt-7 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] divide-x divide-border rounded-sm border border-border bg-card">
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            Photos en ligne
          </div>
          <div className="text-[30px] font-light">{photos.length}</div>
        </div>
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            Retouches incluses
          </div>
          <div className="text-[30px] font-light">{session.includedCount}</div>
        </div>
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            Date de séance
          </div>
          <div className="text-base">{sessionDateLabel}</div>
        </div>
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            Accès expire le
          </div>
          <div className="text-base">{expiresLabel}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-9 px-[4vw] pb-24 pt-9 md:grid-cols-[minmax(0,1fr)_minmax(260px,330px)] md:items-start">
        <SessionGridClient
          sessionId={session.id}
          photos={photos}
          coverPhotoId={cover?.id ?? null}
          locked={locked}
        />

        <aside className="flex flex-col gap-5 md:sticky md:top-24">
          <AccessCard
            sessionId={session.id}
            initialLink={activeToken ? `${baseUrl}/client/set-password/${activeToken.token}` : null}
            initialExpiresAt={activeToken ? activeToken.expiresAt.toISOString() : null}
          />
          <ClientPreviewCard
            sessionId={session.id}
            coverPhotoId={cover?.id ?? null}
            coverFilename={cover?.filename ?? null}
          />
          <DangerZoneCard sessionId={session.id} sessionTitle={session.title} />
        </aside>
      </div>
    </div>
  );
}
