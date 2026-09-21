"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

export default function FileDropZone({
  name,
  accept = "image/*",
  multiple = true,
  error,
}: {
  name: string;
  accept?: string;
  multiple?: boolean;
  /** Set this to the form's current error, if any — a failed submit (e.g.
   * missing category) keeps the picked files instead of clearing them, so
   * the person doesn't have to re-pick after just fixing the other field. */
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  // Once a submit finishes successfully (pending flips back to false with
  // no error), clear the picked files — otherwise the zone still shows the
  // previous batch as "selected" even though it was already sent.
  useEffect(() => {
    if (wasPending.current && !pending && !error) {
      if (inputRef.current) inputRef.current.value = "";
      setFileNames([]);
    }
    wasPending.current = pending;
  }, [pending, error]);

  function readFilesFromInput() {
    const files = inputRef.current?.files;
    setFileNames(files ? Array.from(files).map((f) => f.name) : []);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!inputRef.current || files.length === 0) return;
    inputRef.current.files = files;
    readFilesFromInput();
  }

  return (
    <div
      onDragOver={(e) => {
        if (pending) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (pending) return;
        handleDrop(e);
      }}
      className={`rounded-sm border border-dashed px-6 py-10 text-center transition-colors ${
        dragOver ? "border-fg bg-drop" : "border-drop-border"
      } ${pending ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={readFilesFromInput}
        disabled={pending}
        className="hidden"
      />
      {pending ? (
        <div className="flex flex-col items-center gap-2 text-fg-muted">
          <Spinner className="h-5 w-5" />
          <p className="text-xs">Envoi en cours…</p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-sm border border-fg px-5 py-2.5 text-[13px] tracking-[0.03em] text-fg hover:bg-fg hover:text-bg"
          >
            Choisir des fichiers
          </button>
          <p className="mt-3 text-xs text-fg-muted">ou glissez-déposez vos photos ici</p>
          {fileNames.length > 0 && (
            <p className="mt-3 text-xs text-fg">
              {fileNames.length} fichier{fileNames.length > 1 ? "s" : ""} sélectionné
              {fileNames.length > 1 ? "s" : ""}
            </p>
          )}
        </>
      )}
    </div>
  );
}
