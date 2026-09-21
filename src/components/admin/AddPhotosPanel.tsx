"use client";

import { useActionState, useState } from "react";
import { uploadPhotoAction, type UploadPhotoState } from "@/app/admin/(dashboard)/photos/actions";
import { ALL_CATEGORIES, CATEGORY_LABEL, type PhotoCategory } from "@/lib/types";
import FileDropZone from "./FileDropZone";
import SubmitButton from "./SubmitButton";

export default function AddPhotosPanel() {
  const [state, formAction] = useActionState<UploadPhotoState, FormData>(uploadPhotoAction, {});
  // Persists across uploads on purpose — matches the handoff: the next
  // batch of photos gets the same categories as the last, until changed.
  const [newCats, setNewCats] = useState<Set<PhotoCategory>>(new Set(["PORTRAIT"]));

  function toggle(category: PhotoCategory) {
    setNewCats((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  return (
    <div className="rounded-sm border border-border bg-card p-[22px]">
      <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
        Ajouter des photos
      </div>
      <p className="mb-1 text-sm">Glissez vos photos ici</p>
      <p className="mb-4 text-xs text-fg-muted">JPEG ou PNG, un fichier à la fois si besoin</p>

      <form action={formAction} className="space-y-4">
        <FileDropZone name="files" error={state.error} />

        <div>
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.08em] text-fg-muted">
            Catégorie à l&rsquo;ajout
          </span>
          <div className="flex gap-1.5">
            {ALL_CATEGORIES.map((category) => {
              const active = newCats.has(category);
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(category)}
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
          {newCats.size === 0 && (
            <p className="mt-1.5 text-[11px] text-fg-muted">
              Les photos arriveront sans catégorie.
            </p>
          )}
          {Array.from(newCats).map((c) => (
            <input key={c} type="hidden" name="categories" value={c} />
          ))}
        </div>

        <SubmitButton pendingLabel="Envoi en cours...">Ajouter</SubmitButton>
      </form>
    </div>
  );
}
