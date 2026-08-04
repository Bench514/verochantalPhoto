"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORY_LABEL, type PhotoCategory, type PhotoDTO } from "@/lib/types";

type Filter = "ALL" | PhotoCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "PORTRAIT", label: CATEGORY_LABEL.PORTRAIT },
  { key: "BOUDOIR", label: CATEGORY_LABEL.BOUDOIR },
];

export default function PortfolioGrid({ photos }: { photos: PhotoDTO[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const shown = photos.filter((p) => filter === "ALL" || p.category === filter);

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div className="inline-flex overflow-hidden rounded-sm border border-border">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={
                "px-6 py-2 text-[12px] tracking-[0.03em] transition-colors " +
                (filter === f.key
                  ? "bg-fg text-bg"
                  : "text-fg-muted hover:text-fg")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-center text-fg-muted">Aucune photo dans cette catégorie pour le moment.</p>
      ) : (
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-3 sm:grid-cols-2">
          {shown.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/5] overflow-hidden bg-bg-alt">
              <Image
                src={`/uploads/${photo.filename}`}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
