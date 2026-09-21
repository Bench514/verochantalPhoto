"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  toggleSelectionAction,
  toggleFavoriteAction,
  clearSelectionAction,
  clearFavoritesAction,
  submitSelectionAction,
} from "@/app/client/[sessionId]/actions";
import PhotoTile, { type GalleryPhoto } from "./PhotoTile";
import GalleryLightbox from "./GalleryLightbox";
import ConfirmDialog from "./ConfirmDialog";

type ConfirmAction = "clear-selection" | "clear-favorites" | "submit";

type View = "all" | "selected" | "favorites";

const TAB_LABEL: Record<View, string> = {
  all: "Toutes",
  selected: "Sélectionnées",
  favorites: "Favorites",
};

function tabClass(active: boolean) {
  return `rounded-sm border px-4 py-[9px] text-[11px] uppercase tracking-[0.08em] ${
    active ? "border-fg bg-fg text-bg" : "border-border bg-transparent text-fg-muted"
  }`;
}

export default function GalleryClient({
  sessionId,
  initialPhotos,
  includedCount,
  daysLeft,
  locked,
  contactEmail,
  mailSubject,
}: {
  sessionId: string;
  initialPhotos: GalleryPhoto[];
  includedCount: number;
  daysLeft: number | null;
  locked: boolean;
  contactEmail: string;
  mailSubject: string;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [view, setView] = useState<View>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (view === "selected") return photos.filter((p) => p.selected);
    if (view === "favorites") return photos.filter((p) => p.favorite);
    return photos;
  }, [photos, view]);

  const selCount = photos.filter((p) => p.selected).length;
  const hasFavorites = photos.some((p) => p.favorite);
  const totalLabel = `${photos.length} photo${photos.length > 1 ? "s" : ""}`;
  const openPhoto = openId ? photos.find((p) => p.id === openId) || null : null;

  useEffect(() => {
    if (!openId) return;
    const idx = filtered.findIndex((p) => p.id === openId);
    if (idx < 0) return;
    const neighbors = [filtered[(idx + 1) % filtered.length], filtered[(idx - 1 + filtered.length) % filtered.length]];
    neighbors.forEach((n) => {
      if (!n) return;
      const img = new window.Image();
      img.src = `/session-photos/${n.id}`;
    });
  }, [openId, filtered]);

  function step(delta: number) {
    const idx = filtered.findIndex((p) => p.id === openId);
    if (idx < 0) return;
    setOpenId(filtered[(idx + delta + filtered.length) % filtered.length].id);
  }

  function toggleSelect(id: string) {
    if (locked) return;
    const current = photos.find((p) => p.id === id);
    if (!current) return;
    const next = !current.selected;
    const prev = photos;
    setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, selected: next } : p)));
    startTransition(async () => {
      try {
        await toggleSelectionAction(sessionId, id, next);
      } catch (e) {
        setPhotos(prev);
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function toggleFavorite(id: string) {
    if (locked) return;
    const current = photos.find((p) => p.id === id);
    if (!current) return;
    const next = !current.favorite;
    const prev = photos;
    setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, favorite: next } : p)));
    startTransition(async () => {
      try {
        await toggleFavoriteAction(sessionId, id, next);
      } catch (e) {
        setPhotos(prev);
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function runClearSelection() {
    const prev = photos;
    setPhotos((ps) => ps.map((p) => ({ ...p, selected: false })));
    startTransition(async () => {
      try {
        await clearSelectionAction(sessionId);
      } catch (e) {
        setPhotos(prev);
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function runClearFavorites() {
    const prev = photos;
    setPhotos((ps) => ps.map((p) => ({ ...p, favorite: false })));
    startTransition(async () => {
      try {
        await clearFavoritesAction(sessionId);
      } catch (e) {
        setPhotos(prev);
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function runSubmitSelection() {
    setError(null);
    startTransition(async () => {
      try {
        await submitSelectionAction(sessionId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function requestClearSelection() {
    if (locked || selCount === 0) return;
    setConfirmAction("clear-selection");
  }

  function requestClearFavorites() {
    if (locked || !hasFavorites) return;
    setConfirmAction("clear-favorites");
  }

  function requestSubmitSelection() {
    if (locked || selCount === 0) return;
    setConfirmAction("submit");
  }

  function handleConfirm() {
    if (confirmAction === "clear-selection") runClearSelection();
    else if (confirmAction === "clear-favorites") runClearFavorites();
    else if (confirmAction === "submit") runSubmitSelection();
    setConfirmAction(null);
  }

  let selMessage: string;
  if (selCount === 0) {
    selMessage = "Aucune photo choisie pour le moment. Cochez celles qui vous plaisent.";
  } else if (selCount < includedCount) {
    const left = includedCount - selCount;
    selMessage = `Encore ${left} photo${left > 1 ? "s" : ""} incluses à votre forfait.`;
  } else if (selCount === includedCount) {
    selMessage = "Votre forfait est complet. Vous pouvez confirmer.";
  } else {
    const over = selCount - includedCount;
    selMessage = `${over} photo${over > 1 ? "s" : ""} au-delà du forfait : Véronique vous indiquera le tarif.`;
  }

  return (
    <>
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 px-[5vw] pb-[120px] pt-10 md:grid-cols-[minmax(0,1fr)_minmax(230px,300px)] md:items-start">
        <div>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-signature text-4xl leading-[1.1]">Vos photos</h1>
              <div className="mt-1.5 text-[13px] text-fg-muted">{totalLabel}</div>
            </div>
            <div className="flex gap-2">
              {(["all", "selected", "favorites"] as View[]).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)} className={tabClass(view === v)}>
                  {TAB_LABEL[v]}
                </button>
              ))}
            </div>
          </div>

          {locked && (
            <p className="mb-5 flex items-center gap-2 rounded-sm border border-success/30 bg-success/10 p-4 text-sm text-success">
              <span aria-hidden className="text-base">✓</span>
              Votre sélection a été soumise — elle n&rsquo;est plus modifiable. Véronique a été
              prévenue.
            </p>
          )}

          {hasFavorites && !locked && (
            <div className="-mt-4 mb-5 flex justify-end">
              <button
                type="button"
                onClick={requestClearFavorites}
                className="text-[11px] text-fg-muted underline underline-offset-[3px]"
              >
                Retirer toutes les favorites
              </button>
            </div>
          )}

          {error && <p className="mb-4 text-sm text-fg-muted">{error}</p>}

          {filtered.length === 0 ? (
            <div className="rounded-sm border border-border p-14 text-center text-sm text-fg-muted">
              Aucune photo dans cette vue pour l&rsquo;instant.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3.5">
              {filtered.map((photo) => (
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  locked={locked}
                  onOpen={() => setOpenId(photo.id)}
                  onToggleSelect={() => toggleSelect(photo.id)}
                  onToggleFavorite={() => toggleFavorite(photo.id)}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-5 md:sticky md:top-[110px] md:max-w-[340px]">
          <div className="rounded-sm border border-border p-[22px]">
            <div className="mb-3 text-[11px] uppercase tracking-[0.1em] text-fg-muted">
              Votre sélection
            </div>
            <div className="mb-3 flex items-baseline gap-1.5">
              <span className="text-[32px] font-light">{selCount}</span>
              <span className="text-sm text-fg-muted">/ {includedCount} incluses</span>
            </div>
            <div className="mb-3.5 h-[3px] overflow-hidden bg-border">
              <div
                className="h-full bg-fg transition-[width] duration-200 ease-out"
                style={{ width: `${Math.min(100, (selCount / includedCount) * 100)}%` }}
              />
            </div>
            <p className="mb-4.5 text-[13px] leading-[1.55] text-fg-muted">{selMessage}</p>
            <button
              type="button"
              disabled={locked || selCount === 0}
              onClick={requestSubmitSelection}
              className={`w-full rounded-sm border px-4 py-3.5 text-[11px] uppercase tracking-[0.08em] disabled:cursor-not-allowed ${
                !locked && selCount > 0
                  ? "border-fg bg-fg text-bg"
                  : "border-border bg-transparent text-fg-muted"
              }`}
            >
              Confirmer ma sélection
            </button>
            <button
              type="button"
              disabled={locked || selCount === 0}
              onClick={requestClearSelection}
              className="mt-2.5 w-full text-left text-[11px] underline underline-offset-[3px] disabled:cursor-not-allowed disabled:text-on-dark-muted disabled:no-underline"
            >
              <span className={locked || selCount === 0 ? "text-on-dark-muted" : "text-fg-muted"}>
                Désélectionner tout
              </span>
            </button>
            <p className="mt-3 text-[11px] leading-[1.5] text-fg-muted">
              Rien n&rsquo;est envoyé tant que vous n&rsquo;avez pas confirmé.{" "}
              {daysLeft !== null && `Il vous reste ${daysLeft} jour${daysLeft > 1 ? "s" : ""}.`}
            </p>
          </div>

          <div className="rounded-sm bg-bg-alt p-[22px]">
            <div className="font-signature mb-4 text-2xl leading-[1.1]">Comment faire</div>

            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-sm border border-fg bg-fg text-xs text-bg">
                ✓
              </span>
              <div>
                <div className="mb-0.5 text-[13px]">Le crochet, en haut à droite</div>
                <div className="text-xs leading-[1.55] text-fg-muted">
                  Ajoute la photo à votre sélection officielle, celle que Véronique retouchera.
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full border border-border bg-bg text-xs text-fg">
                ♥
              </span>
              <div>
                <div className="mb-0.5 text-[13px]">Le cœur, au centre</div>
                <div className="text-xs leading-[1.55] text-fg-muted">
                  Apparaît quand la souris survole une photo. Un coup de cœur à garder de côté,
                  sans engagement.
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-sm border border-border bg-bg text-[13px] text-fg">
                ⤢
              </span>
              <div>
                <div className="mb-0.5 text-[13px]">Cliquez sur la photo</div>
                <div className="text-xs leading-[1.55] text-fg-muted">
                  Elle s&rsquo;ouvre en grand. Les flèches du clavier passent à la suivante.
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3.5 text-xs leading-[1.55] text-fg-muted">
              Vous pouvez revenir, ajouter et retirer autant de fois que vous le voulez avant de
              confirmer.
            </div>
          </div>

          <div className="rounded-sm border border-border p-5">
            <div className="mb-1.5 text-[13px]">Une question ?</div>
            <p className="mb-3.5 text-xs leading-[1.55] text-fg-muted">
              Une envie particulière pour la retouche, un doute entre deux photos : écrivez-moi.
            </p>
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(mailSubject)}`}
              className="inline-block rounded-sm border border-fg px-[18px] py-2.5 text-[11px] uppercase tracking-[0.08em] text-fg"
            >
              Écrire à Véronique
            </a>
          </div>
        </aside>
      </div>

      {openPhoto && (
        <GalleryLightbox
          photo={openPhoto}
          total={photos.length}
          locked={locked}
          onClose={() => setOpenId(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToggleSelect={() => toggleSelect(openPhoto.id)}
          onToggleFavorite={() => toggleFavorite(openPhoto.id)}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          title={
            confirmAction === "submit"
              ? "Confirmer votre sélection ?"
              : confirmAction === "clear-selection"
                ? "Désélectionner tout ?"
                : "Retirer les favorites ?"
          }
          message={
            confirmAction === "submit"
              ? `${selCount} photo${selCount > 1 ? "s" : ""} sélectionnée${selCount > 1 ? "s" : ""}. Cette action est définitive — vous ne pourrez plus modifier votre choix après.`
              : confirmAction === "clear-selection"
                ? "Toutes les photos cochées seront désélectionnées."
                : "Tous vos coups de cœur seront retirés."
          }
          confirmLabel={confirmAction === "submit" ? "Confirmer ma sélection" : "Confirmer"}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </>
  );
}
