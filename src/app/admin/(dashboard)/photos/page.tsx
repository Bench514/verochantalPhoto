import Link from "next/link";
import { prisma } from "@/lib/db";
import type { PhotoDTO } from "@/lib/types";
import PortfolioGridClient from "@/components/admin/PortfolioGridClient";
import AddPhotosPanel from "@/components/admin/AddPhotosPanel";

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
    sizeBytes: p.sizeBytes,
    createdAt: p.createdAt.toISOString(),
    categories: p.categories.map((c) => ({ category: c.category, order: c.order })),
  }));

  const portraitCount = photos.filter((p) => p.categories.some((c) => c.category === "PORTRAIT"))
    .length;
  const boudoirCount = photos.filter((p) => p.categories.some((c) => c.category === "BOUDOIR"))
    .length;
  const noCategoryCount = photos.filter((p) => p.categories.length === 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 px-[4vw] pt-9">
        <div className="max-w-[620px]">
          <h1 className="font-name text-[clamp(34px,4.4vw,52px)] italic leading-none">
            Photos du portfolio
          </h1>
          <p className="mt-3 text-sm text-fg-muted">
            Téléversez les photos, classez-les en Portrait et/ou Boudoir, et ajustez leur ordre
            d&rsquo;affichage dans la grille publique.
          </p>
        </div>
        <Link
          href="/portfolio"
          className="rounded-sm border border-border px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-fg hover:border-fg"
        >
          Voir la page publique
        </Link>
      </div>

      <div className="mx-[4vw] mt-7 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] divide-x divide-border rounded-sm border border-border bg-card">
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            Photos en ligne
          </div>
          <div className="text-[30px] font-light">{photos.length}</div>
        </div>
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">Portrait</div>
          <div className="text-[30px] font-light">{portraitCount}</div>
        </div>
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">Boudoir</div>
          <div className="text-[30px] font-light">{boudoirCount}</div>
        </div>
        <div className="px-6 py-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.12em] text-fg-muted">
            Sans catégorie
          </div>
          <div className={`text-[30px] font-light ${noCategoryCount === 0 ? "text-fg-disabled" : ""}`}>
            {noCategoryCount}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-9 px-[4vw] pb-24 pt-9 md:grid-cols-[minmax(0,1fr)_minmax(260px,330px)] md:items-start">
        <PortfolioGridClient photos={photos} />

        <aside className="flex flex-col gap-5 md:sticky md:top-24">
          <AddPhotosPanel />

          <div className="rounded-sm border border-border bg-card p-[22px]">
            <div className="mb-1.5 text-[13px]">Ordre d&rsquo;affichage</div>
            <p className="text-xs leading-[1.55] text-fg-muted">
              Le numéro sur chaque vignette est sa position dans la grille publique de la
              catégorie affichée. Glissez une photo (poignée ⠿ au survol) pour la déplacer —
              actif uniquement dans l&rsquo;onglet Portrait ou Boudoir, puisque c&rsquo;est
              l&rsquo;ordre qui s&rsquo;affiche vraiment sur le site.
            </p>
          </div>

          <div className="rounded-sm border border-border p-[22px]">
            <div className="mb-1.5 text-[13px]">À surveiller</div>
            <p className="text-xs leading-[1.55] text-fg-muted">
              {noCategoryCount > 0
                ? `${noCategoryCount} photo${noCategoryCount > 1 ? "s n'apparaissent" : " n'apparaît"} sur aucune page publique, faute de catégorie.`
                : "Toutes les photos sont classées dans au moins une catégorie."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
