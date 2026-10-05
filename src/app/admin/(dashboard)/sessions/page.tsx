import Link from "next/link";
import { prisma } from "@/lib/db";
import NewSessionModal from "@/components/admin/NewSessionModal";
import { SESSION_STATUS_LABEL } from "@/lib/types";

export default async function AdminSessionsPage() {
  const sessions = await prisma.photoSession.findMany({
    include: { client: true, _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">Galeries clients</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Crée une galerie, uploade les photos, puis invite le client à se connecter pour faire sa
            sélection.
          </p>
        </div>
        <NewSessionModal />
      </div>

      <div className="mt-8">
        <div>
          {sessions.length === 0 ? (
            <p className="text-sm text-fg-muted">Aucune sÃ©ance pour l&rsquo;instant.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/sessions/${s.id}`}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-sm border border-border p-4 hover:border-fg"
                  >
                    <div className="min-w-0">
                      <span className="text-sm">{s.title}</span>
                      <span className="ml-2 break-all text-xs text-fg-muted">{s.client.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-fg-muted">
                      <span>{s._count.photos} photo(s)</span>
                      <span>{SESSION_STATUS_LABEL[s.status]}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
