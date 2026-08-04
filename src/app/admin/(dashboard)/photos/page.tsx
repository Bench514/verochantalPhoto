import { prisma } from "@/lib/db";
import { ALL_CATEGORIES, CATEGORY_LABEL, type PhotoDTO } from "@/lib/types";
import PhotoRow from "@/components/admin/PhotoRow";
import { uploadPhotoAction } from "./actions";

export default async function AdminPhotosPage() {
  const rows = await prisma.photo.findMany({
    include: { categories: true },
    orderBy: { createdAt: "asc" },
  });

  const photos: PhotoDTO[] = rows.map((p) => ({
    id: p.id,
    filename: p.filename,
    name: p.name,
    alt: p.alt,
    createdAt: p.createdAt.toISOString(),
    categories: p.categories.map((c) => ({ category: c.category, order: c.order })),
  }));

  return (
    <div>
      <h1 className="text-2xl">Photos du portfolio</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Ces photos alimentent la grille de la page Portfolio publique. Une photo peut
        appartenir à une ou aux deux catégories.
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
          <span className="mb-1.5 block text-[13px] text-fg-muted">Catégorie(s)</span>
          <div className="flex items-center gap-3 py-2">
            {ALL_CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="categories" value={c} />
                {CATEGORY_LABEL[c]}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="rounded-sm bg-fg px-5 py-2.5 text-[13px] tracking-[0.03em] text-bg hover:opacity-85"
        >
          Ajouter
        </button>
      </form>

      {ALL_CATEGORIES.map((category) => {
        const items = photos
          .filter((p) => p.categories.some((c) => c.category === category))
          .sort((a, b) => {
            const oa = a.categories.find((c) => c.category === category)!.order;
            const ob = b.categories.find((c) => c.category === category)!.order;
            return oa - ob;
          });
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
                  sectionCategory={category}
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
