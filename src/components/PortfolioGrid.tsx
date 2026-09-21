"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CATEGORY_LABEL, type PhotoCategory, type PhotoDTO } from "@/lib/types";
import PhotoLightbox from "./PhotoLightbox";

type Filter = "ALL" | PhotoCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "PORTRAIT", label: CATEGORY_LABEL.PORTRAIT },
  { key: "BOUDOIR", label: CATEGORY_LABEL.BOUDOIR },
];

export default function PortfolioGrid({ photos }: { photos: PhotoDTO[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selected, setSelected] = useState<PhotoDTO | null>(null);

  const shown = useMemo(() => {
    if (filter === "ALL") {
      return [...photos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return photos
      .filter((p) => p.categories.some((c) => c.category === filter))
      .sort((a, b) => {
        const oa = a.categories.find((c) => c.category === filter)!.order;
        const ob = b.categories.find((c) => c.category === filter)!.order;
        return oa - ob;
      });
  }, [photos, filter]);

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
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 sm:grid-cols-3">
          {shown.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo)}
              className="group relative aspect-[4/5] overflow-hidden bg-bg-alt text-left"
            >
              <Image
                src={`/uploads/${photo.filename}`}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, 30vw"
                className="object-cover"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2.5 text-[13px] text-on-dark opacity-0 transition-opacity group-hover:opacity-100">
                {photo.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && <PhotoLightbox photo={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
