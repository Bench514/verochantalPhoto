"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  deletePhotoAction,
  toggleCategoryAction,
} from "@/app/admin/(dashboard)/photos/actions";
import { ALL_CATEGORIES, CATEGORY_LABEL, type PhotoCategory, type PhotoDTO } from "@/lib/types";

export default function PhotoCard({
  photo,
  position,
  checked,
  onToggleCheck,
  reorderable,
}: {
  photo: PhotoDTO;
  position: number;
  checked: boolean;
  onToggleCheck: () => void;
  /** Whether the current tab has a real, persistable order (Portrait / Boudoir). */
  reorderable: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const activeCategories = new Set(photo.categories.map((c) => c.category));

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
    disabled: !reorderable,
  });

  function toggleCategory(category: PhotoCategory) {
    setError(null);
    const enabled = !activeCategories.has(category);
    startTransition(async () => {
      try {
        await toggleCategoryAction(photo.id, category, enabled);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function remove() {
    if (!confirm(`Supprimer « ${photo.name} » ?`)) return;
    startTransition(() => deletePhotoAction(photo.id));
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`overflow-hidden rounded-sm border bg-card ${
        checked ? "border-fg" : "border-card-border"
      } ${isDragging ? "z-10 opacity-70" : ""}`}
    >
      <div className="group relative aspect-[3/4] bg-bg-alt">
        <Image
          src={`/uploads/${photo.filename}`}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 180px"
          className="object-cover"
        />

        <div className="pointer-events-none absolute left-0 top-0 rounded-br-sm bg-dark/75 px-2.5 py-1 text-[9px] tracking-[0.12em] text-on-dark">
          {String(position).padStart(2, "0")}
        </div>

        <button
          type="button"
          onClick={onToggleCheck}
          aria-pressed={checked}
          aria-label={checked ? `Retirer ${photo.name} de la sélection` : `Sélectionner ${photo.name}`}
          className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm border text-xs ${
            checked
              ? "border-fg bg-fg text-bg"
              : "border-on-dark/80 bg-on-dark/85 text-transparent"
          }`}
        >
          ✓
        </button>

        {reorderable && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Réordonner ${photo.name} — glisser-déposer`}
            className="absolute right-11 top-2 flex h-6 w-[30px] cursor-grab items-center justify-center rounded-sm border border-on-dark/60 bg-dark/40 text-on-dark opacity-0 transition-opacity duration-150 ease-in-out active:cursor-grabbing group-hover:opacity-100"
          >
            ⠿
          </button>
        )}

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-dark/40 p-2 opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100">
          <button
            type="button"
            disabled={pending}
            onClick={remove}
            className="pointer-events-auto rounded-sm bg-bg px-3 py-2 text-xs text-fg"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="border-t border-card-border p-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs" title={photo.name}>
            {photo.name}
          </span>
          <span className="shrink-0 text-[11px] text-fg-muted">
            {Math.round(photo.sizeBytes / 1024)} Ko
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {ALL_CATEGORIES.map((category) => {
            const active = activeCategories.has(category);
            return (
              <button
                key={category}
                type="button"
                disabled={pending}
                aria-pressed={active}
                aria-label={`Classer ${photo.name} en ${CATEGORY_LABEL[category].toLowerCase()}`}
                onClick={() => toggleCategory(category)}
                className={`flex-1 rounded-sm border px-2 py-[7px] text-[10px] uppercase tracking-[0.08em] ${
                  active
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-transparent text-fg-muted"
                }`}
              >
                {CATEGORY_LABEL[category]}
              </button>
            );
          })}
        </div>
        {error && <p className="mt-1.5 text-[11px] text-fg-muted">{error}</p>}
      </div>
    </div>
  );
}
