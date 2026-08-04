import { prisma } from "@/lib/db";
import { CATEGORY_LABEL, type PhotoCategory } from "@/lib/types";
import PhotoRow from "@/components/admin/PhotoRow";
import { uploadPhotoAction } from "./actions";

const CATEGORIES: PhotoCategory[] = ["PORTRAIT", "BOUDOIR"];

export default async function AdminPhotosPage() {
  const photos = await prisma.photo.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl">Photos du portfolio</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Ces photos alimentent la grille de la page Portfolio publique.
      </p>

      <form
        action={uploadPhotoAction}
        encType="multipart/form-data"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-sm bg-bg-alt p-6"
      >
        <div>
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="file">
            Nouvelle photo
          </label>
          <input id="file" name="file" type="file" accept="image/*" required className="text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            required
            className="rounded-sm border border-border bg-bg px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-sm bg-fg px-5 py-2.5 text-[13px] tracking-[0.03em] text-bg hover:opacity-85"
        >
          Ajouter
        </button>
      </form>

      {CATEGORIES.map((category) => {
        const items = photos.filter((p) => p.category === category);
        return (
          <div key={category} className="mt-10">
            <h2 className="mb-2 text-sm uppercase tracking-[0.06em] text-fg-muted">
              {CATEGORY_LABEL[category]} ({items.length})
            </h2>
            {items.length === 0 ? (
              <p className="py-4 text-sm text-fg-muted">Aucune photo.</p>
            ) : (
              items.map((photo, i) => (
                <PhotoRow
                  key={photo.id}
                  photo={photo}
                  isFirst={i === 0}
                  isLast={i === items.length - 1}
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
