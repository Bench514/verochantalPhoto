import Link from "next/link";

export default function ClientPreviewCard({
  sessionId,
  coverPhotoId,
  coverFilename,
}: {
  sessionId: string;
  coverPhotoId: string | null;
  coverFilename: string | null;
}) {
  return (
    <div className="rounded-sm border border-border bg-card p-[22px]">
      <div className="mb-3 text-[13px]">Aperçu client</div>
      <div className="mb-4 flex items-center gap-3">
        {coverPhotoId ? (
          // eslint-disable-next-line @next/next/no-img-element -- a dynamic src on next/image here triggers a parasite preload-scanner request; a plain <img> avoids it (per design handoff).
          <img
            src={`/session-photos/${coverPhotoId}`}
            alt=""
            className="h-[74px] w-14 shrink-0 rounded-sm object-cover"
          />
        ) : (
          <div className="h-[74px] w-14 shrink-0 rounded-sm bg-bg-alt" />
        )}
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.12em] text-fg-muted">Couverture</div>
          <div className="truncate text-[13px]" title={coverFilename ?? ""}>
            {coverFilename ?? "Aucune photo"}
          </div>
        </div>
      </div>
      <p className="mb-3 text-[13px] leading-[1.55] text-fg-muted">
        C&rsquo;est ce que le client voit en arrivant dans son espace.
      </p>
      <Link
        href={`/client/${sessionId}/galerie`}
        target="_blank"
        className="inline-block rounded-sm border border-fg px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-fg"
      >
        Ouvrir la galerie
      </Link>
    </div>
  );
}
