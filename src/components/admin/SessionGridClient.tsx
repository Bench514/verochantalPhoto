"use client";

import { useActionState, useState, useTransition } from "react";
import {
  uploadSessionPhotosAction,
  deleteSessionPhotosAction,
  type UploadSessionPhotosState,
} from "@/app/admin/(dashboard)/sessions/actions";
import type { SessionPhotoDTO } from "@/lib/types";
import FileDropZone from "./FileDropZone";
import SubmitButton from "./SubmitButton";
import SessionPhotoCard from "./SessionPhotoCard";

export default function SessionGridClient({
  sessionId,
  photos,
  coverPhotoId,
  locked,
}: {
  sessionId: string;
  photos: SessionPhotoDTO[];
  coverPhotoId: string | null;
  locked: boolean;
}) {
  const [uploadState, uploadAction] = useActionState<UploadSessionPhotosState, FormData>(
    uploadSessionPhotosAction,
    {}
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const allSelected = photos.length > 0 && photos.every((p) => selected.has(p.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(photos.map((p) => p.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkDelete() {
    const ids = Array.from(selected);
    if (!confirm(`Supprimer ${ids.length} photo(s) ? Cette action est irréversible.`)) return;
    setDeleteError(null);
    startTransition(async () => {
      try {
        await deleteSessionPhotosAction(ids, sessionId);
        setSelected(new Set());
      } catch (e) {
        setDeleteError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-signature text-[32px] leading-none">Photos de la séance</h2>
        {!locked && (
          <div className="flex items-center gap-4 text-xs text-fg-muted">
            <button
              type="button"
              onClick={toggleAll}
              disabled={photos.length === 0}
              className="underline decoration-border underline-offset-4 disabled:opacity-40"
            >
              {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
            <span>
              {selected.size > 0
                ? `${selected.size} sélectionnée(s)`
                : `${photos.length} photo${photos.length > 1 ? "s" : ""}`}
            </span>
          </div>
        )}
      </div>

      {locked && (
        <p className="mb-5 rounded-sm border border-border bg-bg-alt p-4 text-sm text-fg-muted">
          La sélection du client a été reçue — les photos de cette séance ne peuvent plus être
          ajoutées ni supprimées.
        </p>
      )}

      {!locked && (
        <form action={uploadAction} className="mb-5">
          <input type="hidden" name="sessionId" value={sessionId} />
          <FileDropZone name="files" error={uploadState.error} />
          <div className="mt-3 flex justify-end">
            <SubmitButton pendingLabel="Envoi en cours...">Choisir des fichiers</SubmitButton>
          </div>
        </form>
      )}

      {selected.size > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-dark px-4.5 py-3 text-on-dark">
          <span className="text-[13px]">{selected.size} sélectionnée(s)</span>
          <div className="flex flex-wrap gap-2">
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
              Supprimer la sélection
            </button>
          </div>
        </div>
      )}
      {deleteError && <p className="mb-4 text-sm text-fg-muted">{deleteError}</p>}

      {photos.length === 0 ? (
        <div className="rounded-sm border border-border p-14 text-center text-sm text-fg-muted">
          Aucune photo pour l&rsquo;instant.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
          {photos.map((photo) => (
            <SessionPhotoCard
              key={photo.id}
              photo={photo}
              sessionId={sessionId}
              isCover={photo.id === coverPhotoId}
              checked={selected.has(photo.id)}
              onToggleCheck={() => toggleOne(photo.id)}
              locked={locked}
            />
          ))}
        </div>
      )}
    </div>
  );
}
