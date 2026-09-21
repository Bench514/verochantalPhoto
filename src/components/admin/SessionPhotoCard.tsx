"use client";

import Image from "next/image";
import { useTransition } from "react";
import {
  deleteSessionPhotoAction,
  setCoverPhotoAction,
} from "@/app/admin/(dashboard)/sessions/actions";
import type { SessionPhotoDTO } from "@/lib/types";

export default function SessionPhotoCard({
  photo,
  sessionId,
  isCover,
  checked,
  onToggleCheck,
  locked,
}: {
  photo: SessionPhotoDTO;
  sessionId: string;
  isCover: boolean;
  checked: boolean;
  onToggleCheck: () => void;
  locked: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!confirm(`Supprimer « ${photo.filename} » ?`)) return;
    startTransition(() => deleteSessionPhotoAction(photo.id, sessionId));
  }

  function makeCover() {
    startTransition(() => setCoverPhotoAction(sessionId, photo.id));
  }

  return (
    <div
      className={`overflow-hidden rounded-sm border bg-card ${
        checked ? "border-fg" : "border-card-border"
      }`}
    >
      <div className="group relative aspect-[3/4] bg-bg-alt">
        <Image
          src={`/session-photos/${photo.id}`}
          alt=""
          fill
          unoptimized
          loading="lazy"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 160px"
          className="object-cover"
        />

        {isCover && (
          <div className="pointer-events-none absolute left-0 top-0 rounded-br-sm bg-dark px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-on-dark">
            Couverture
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCheck}
          disabled={locked}
          aria-pressed={checked}
          aria-label={checked ? "Retirer de la sélection" : "Sélectionner cette photo"}
          className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm border text-xs disabled:cursor-default ${
            checked
              ? "border-fg bg-fg text-bg"
              : "border-on-dark/80 bg-on-dark/85 text-transparent"
          }`}
        >
          ✓
        </button>

        {!locked && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-1.5 bg-dark/35 p-2 opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100">
            {!isCover && (
              <button
                type="button"
                disabled={pending}
                onClick={makeCover}
                className="pointer-events-auto w-full rounded-sm border border-on-dark px-3 py-2 text-xs text-on-dark"
              >
                Définir en couverture
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="pointer-events-auto w-full rounded-sm bg-bg px-3 py-2 text-xs text-fg"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-card-border px-3 py-2.5">
        <span className="truncate text-xs" title={photo.filename}>
          {photo.filename}
        </span>
        <span className="shrink-0 text-[11px] text-fg-muted">
          {Math.round(photo.sizeBytes / 1024)} Ko
        </span>
      </div>
    </div>
  );
}
