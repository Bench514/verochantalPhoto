"use client";

import Image from "next/image";

export type GalleryPhoto = {
  id: string;
  no: string;
  selected: boolean;
  favorite: boolean;
};

export default function PhotoTile({
  photo,
  locked,
  onOpen,
  onToggleSelect,
  onToggleFavorite,
}: {
  photo: GalleryPhoto;
  locked: boolean;
  onOpen: () => void;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div
      className="group relative aspect-[2/3] cursor-zoom-in overflow-hidden rounded-sm bg-bg-alt"
      onClick={onOpen}
    >
      <Image
        src={`/session-photos/${photo.id}`}
        alt=""
        fill
        unoptimized
        loading="lazy"
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        className="object-cover"
      />

      {/* Cadre de sélection */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-sm ${
          photo.selected ? "border-[3px] border-fg" : ""
        }`}
      />

      {/* Voile de survol + coeur */}
      <div className="absolute inset-0 flex items-center justify-center bg-dark/28 opacity-0 transition-opacity duration-[180ms] ease-in-out group-hover:opacity-100">
        <button
          type="button"
          title="Mettre en favori"
          disabled={locked}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border border-on-dark/70 text-xl disabled:cursor-default ${
            photo.favorite ? "bg-bg text-fg" : "bg-dark/30 text-on-dark"
          }`}
        >
          ♥
        </button>
      </div>

      {/* Pastille de coche — toujours visible */}
      <button
        type="button"
        title="Choisir cette photo"
        disabled={locked}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        className={`absolute right-[9px] top-[9px] flex h-7 w-7 items-center justify-center rounded-full border text-[13px] leading-none transition-all duration-150 ease-in-out disabled:cursor-default ${
          photo.selected
            ? "border-fg bg-fg text-bg"
            : "border-on-dark/80 bg-dark/25 text-on-dark"
        }`}
      >
        ✓
      </button>

      {photo.favorite && (
        <span className="pointer-events-none absolute left-[9px] top-[9px] text-[13px] text-on-dark [text-shadow:0_1px_3px_rgba(25,24,22,.7)]">
          ♥
        </span>
      )}

      <div className="pointer-events-none absolute bottom-2 left-2 text-[10px] tracking-[0.08em] text-on-dark [text-shadow:0_1px_3px_rgba(25,24,22,.6)]">
        {photo.no}
      </div>
    </div>
  );
}
