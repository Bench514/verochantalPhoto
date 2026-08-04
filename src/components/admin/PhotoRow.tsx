"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  deletePhotoAction,
  moveAction,
  toggleCategoryAction,
} from "@/app/admin/(dashboard)/photos/actions";
import { ALL_CATEGORIES, CATEGORY_LABEL, type PhotoCategory, type PhotoDTO } from "@/lib/types";

export default function PhotoRow({
  photo,
  sectionCategory,
  isFirst,
  isLast,
}: {
  photo: PhotoDTO;
  sectionCategory: PhotoCategory;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const activeCategories = new Set(photo.categories.map((c) => c.category));

  function toggle(category: PhotoCategory, checked: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        await toggleCategoryAction(photo.id, category, checked);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div className="border-b border-border py-3">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-bg-alt">
          <Image src={`/uploads/${photo.filename}`} alt="" fill className="object-cover" />
        </div>

        <span className="text-sm text-fg-muted">{photo.name}</span>

        <div className="flex items-center gap-3">
          {ALL_CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-1.5 text-xs text-fg-muted">
              <input
                type="checkbox"
                disabled={pending}
                checked={activeCategories.has(category)}
                onChange={(e) => toggle(category, e.target.checked)}
              />
              {CATEGORY_LABEL[category]}
            </label>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            disabled={pending || isFirst}
            onClick={() => startTransition(() => moveAction(photo.id, sectionCategory, "up"))}
            className="rounded-sm border border-border px-2 py-1 text-xs disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={pending || isLast}
            onClick={() => startTransition(() => moveAction(photo.id, sectionCategory, "down"))}
            className="rounded-sm border border-border px-2 py-1 text-xs disabled:opacity-30"
          >
            ↓
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm("Supprimer cette photo ?")) {
                startTransition(() => deletePhotoAction(photo.id));
              }
            }}
            className="rounded-sm border border-border px-2 py-1 text-xs hover:bg-fg hover:text-bg"
          >
            Supprimer
          </button>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-fg-muted">{error}</p>}
    </div>
  );
}
