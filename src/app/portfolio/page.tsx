import SiteNav from "@/components/SiteNav";
import PortfolioGrid from "@/components/PortfolioGrid";
import { prisma } from "@/lib/db";
import type { PhotoDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
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
    <>
      <SiteNav active="portfolio" />
      <section className="px-[6vw] py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <h1 className="text-[clamp(28px,3.4vw,40px)]">Portfolio</h1>
          <p className="mt-3 text-fg-muted">
            Un aperçu de séances portrait et boudoir, telles que vécues par les personnes
            photographiées.
          </p>
        </div>
        <div className="mt-12">
          <PortfolioGrid photos={photos} />
        </div>
      </section>
    </>
  );
}
