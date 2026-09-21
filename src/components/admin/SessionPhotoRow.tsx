"use client";

import Image from "next/image";
import { useTransition } from "react";
import { deleteSessionPhotoAction } from "@/app/admin/(dashboard)/sessions/actions";
import type { SessionPhotoDTO } from "@/lib/types";

export default function SessionPhotoRow({
  photo,
  sessionId,
  locked,
}: {
  photo: SessionPhotoDTO;
  sessionId: string;
  locked: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 border-b border-border py-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-bg-alt">
        <Image
          src={`/session-photos/${photo.id}`}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      </div>
      <span className="text-sm text-fg-muted">
        {photo.filename}
        <span className="ml-2 text-xs text-fg-muted/70">
          {Math.round(photo.sizeBytes / 1024)} Ko
        </span>
      </span>
      {photo.selected && (
        <span className="rounded-sm bg-fg px-2 py-0.5 text-xs text-bg">Sélectionnée</span>
      )}
      <button
        type="button"
        disabled={pending || locked}
        title={locked ? "Séance soumise — verrouillée" : undefined}
        onClick={() => {
          if (confirm("Supprimer cette photo ?")) {
            startTransition(() => deleteSessionPhotoAction(photo.id, sessionId));
          }
        }}
        className="ml-auto rounded-sm border border-border px-2 py-1 text-xs hover:bg-fg hover:text-bg disabled:opacity-30"
      >
        Supprimer
      </button>
    </div>
  );
}
