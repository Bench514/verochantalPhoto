"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "./PhotoTile";

export default function GalleryLightbox({
  photo,
  total,
  locked,
  onClose,
  onPrev,
  onNext,
  onToggleSelect,
  onToggleFavorite,
}: {
  photo: GalleryPhoto;
  total: number;
  locked: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/96 p-8">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex max-h-full flex-col items-center gap-[18px]">
        <div className="relative h-[74vh] w-[78vw]">
          <Image
            src={`/session-photos/${photo.id}`}
            alt=""
            fill
            unoptimized
            className="object-contain"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={locked}
            onClick={onToggleSelect}
            className={`rounded-sm border px-[22px] py-3 text-[11px] uppercase tracking-[0.08em] disabled:cursor-default ${
              photo.selected ? "border-bg bg-bg text-fg" : "border-on-dark/50 text-on-dark"
            }`}
          >
            {photo.selected ? "✓ Choisie" : "Choisir cette photo"}
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={onToggleFavorite}
            className={`rounded-sm border px-[22px] py-3 text-[11px] uppercase tracking-[0.08em] disabled:cursor-default ${
              photo.favorite ? "border-bg bg-bg text-fg" : "border-on-dark/50 text-on-dark"
            }`}
          >
            {photo.favorite ? "♥ Favorite" : "♥ Coup de cœur"}
          </button>
        </div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-on-dark-muted">
          Photo {photo.no} — {total} photo{total > 1 ? "s" : ""}
        </div>
      </div>

      <button
        type="button"
        onClick={onPrev}
        aria-label="Photo précédente"
        className="absolute left-[3vw] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-on-dark/40 text-on-dark"
      >
        ←
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Photo suivante"
        className="absolute right-[3vw] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm border border-on-dark/40 text-on-dark"
      >
        →
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-[3vw] top-7 flex h-10 w-10 items-center justify-center rounded-sm border border-on-dark/40 text-on-dark"
      >
        ✕
      </button>
    </div>
  );
}
