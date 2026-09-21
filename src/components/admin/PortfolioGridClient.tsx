"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import {
  bulkAddCategoryAction,
  bulkDeletePhotosAction,
  bulkSetOnlyCategoryAction,
  reorderCategoryAction,
} from "@/app/admin/(dashboard)/photos/actions";
import { CATEGORY_LABEL, type PhotoCategory, type PhotoDTO } from "@/lib/types";
import PhotoCard from "./PhotoCard";

type View = "all" | "portrait" | "boudoir" | "none";

const TABS: { key: View; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "portrait", label: "Portrait" },
  { key: "boudoir", label: "Boudoir" },
  { key: "none", label: "Sans catégorie" },
];

function orderIn(photo: PhotoDTO, category: PhotoCategory): number {
  return photo.categories.find((c) => c.category === category)?.order ?? 0;
}

export default function PortfolioGridClient({ photos }: { photos: PhotoDTO[] }) {
  const [view, setView] = useState<View>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Local copy so a drop can reorder instantly, ahead of the server round
  // trip. Re-synced whenever fresh data comes down from the server (after
  // any mutation's revalidation) — a reorder we just persisted lands back
  // here in the same order, so this causes no visible flicker. Adjusting
  // state during render (React's sanctioned pattern for this) rather than
  // in an effect, which would cause an extra render pass.
  const [prevPhotos, setPrevPhotos] = useState(photos);
  const [localPhotos, setLocalPhotos] = useState(photos);
  if (photos !== prevPhotos) {
    setPrevPhotos(photos);
    setLocalPhotos(photos);
  }

  const filtered = useMemo(() => {
    if (view === "portrait" || view === "boudoir") {
      const category: PhotoCategory = view === "portrait" ? "PORTRAIT" : "BOUDOIR";
      return localPhotos
        .filter((p) => p.categories.some((c) => c.category === category))
        .sort((a, b) => orderIn(a, category) - orderIn(b, category));
    }
    if (view === "none") {
      return localPhotos
        .filter((p) => p.categories.length === 0)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return [...localPhotos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [localPhotos, view]);

  const moveCategory: PhotoCategory | null =
    view === "portrait" ? "PORTRAIT" : view === "boudoir" ? "BOUDOIR" : null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!moveCategory || !over || active.id === over.id) return;
    const oldIndex = filtered.findIndex((p) => p.id === active.id);
    const newIndex = filtered.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(filtered, oldIndex, newIndex);
    setLocalPhotos((prev) => {
      const positions = new Map(reordered.map((p, i) => [p.id, i]));
      return prev.map((p) =>
        positions.has(p.id)
          ? {
              ...p,
              categories: p.categories.map((c) =>
                c.category === moveCategory ? { ...c, order: positions.get(p.id)! } : c
              ),
            }
          : p
      );
    });
    startTransition(() => reorderCategoryAction(moveCategory, reordered.map((p) => p.id)));
  }

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addCategory(category: PhotoCategory) {
    const ids = Array.from(selected);
    startTransition(async () => {
      await bulkAddCategoryAction(ids, category);
      setSelected(new Set());
    });
  }

  function setOnlyCategory(category: PhotoCategory) {
    const ids = Array.from(selected);
    startTransition(async () => {
      await bulkSetOnlyCategoryAction(ids, category);
      setSelected(new Set());
    });
  }

  function bulkDelete() {
    const ids = Array.from(selected);
    if (!confirm(`Supprimer ${ids.length} photo(s) ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      await bulkDeletePhotosAction(ids);
      setSelected(new Set());
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setView(tab.key)}
              className={`rounded-sm border px-4 py-[9px] text-[11px] uppercase tracking-[0.08em] ${
                view === tab.key
                  ? "border-fg bg-fg text-bg"
                  : "border-border bg-transparent text-fg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-fg-muted">
          <button
            type="button"
            onClick={toggleAll}
            disabled={filtered.length === 0}
            className="underline decoration-border underline-offset-4 disabled:opacity-40"
          >
            {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
          </button>
          <span>
            {filtered.length} photo{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-dark px-4.5 py-3 text-on-dark">
          <span className="text-[13px]">{selected.size} sélectionnée(s)</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => setOnlyCategory("PORTRAIT")}
              className="rounded-sm border border-on-dark/40 px-3.5 py-2 text-[11px] uppercase tracking-[0.06em]"
            >
              {CATEGORY_LABEL.PORTRAIT} seulement
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => addCategory("PORTRAIT")}
              className="rounded-sm border border-on-dark/40 px-3.5 py-2 text-[11px] uppercase tracking-[0.06em]"
            >
              Ajouter dans {CATEGORY_LABEL.PORTRAIT.toLowerCase()}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setOnlyCategory("BOUDOIR")}
              className="rounded-sm border border-on-dark/40 px-3.5 py-2 text-[11px] uppercase tracking-[0.06em]"
            >
              {CATEGORY_LABEL.BOUDOIR} seulement
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => addCategory("BOUDOIR")}
              className="rounded-sm border border-on-dark/40 px-3.5 py-2 text-[11px] uppercase tracking-[0.06em]"
            >
              Ajouter dans {CATEGORY_LABEL.BOUDOIR.toLowerCase()}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setSelected(new Set())}
              className="rounded-sm border border-on-dark/40 px-3.5 py-2 text-[11px] uppercase tracking-[0.06em]"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={bulkDelete}
              className="rounded-sm bg-bg px-3.5 py-2 text-[11px] uppercase tracking-[0.06em] text-fg"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-border p-14 text-center text-sm text-fg-muted">
          Aucune photo dans cette vue.
        </div>
      ) : moveCategory ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5">
              {filtered.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  position={i + 1}
                  checked={selected.has(photo.id)}
                  onToggleCheck={() => toggleOne(photo.id)}
                  reorderable
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5">
          {filtered.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              position={i + 1}
              checked={selected.has(photo.id)}
              onToggleCheck={() => toggleOne(photo.id)}
              reorderable={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
