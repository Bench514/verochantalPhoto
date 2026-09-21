import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import { clientLogoutAction } from "../actions";
import Logo from "@/components/Logo";
import { isSessionLocked } from "@/lib/types";

export default async function ClientHomePage() {
  const userId = await getClientUserId();

  // Scoped by clientId, not by anything the client could tamper with — this
  // is the isolation boundary: a client only ever sees rows where they are
  // the owner.
  const [user, sessions] = userId
    ? await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.photoSession.findMany({ where: { clientId: userId }, orderBy: { createdAt: "desc" } }),
      ])
    : [null, []];

  // Most clients only ever have one session — skip this selector and go
  // straight to their portal. It only earns its keep for repeat clients.
  if (sessions.length === 1) redirect(`/client/${sessions[0].id}`);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm rounded-sm bg-bg-alt p-9">
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo shape="monogram" />
          <div>
            <h1 className="font-signature text-3xl leading-none">Vos séances</h1>
            {user?.name && <p className="mt-2 text-sm text-fg-muted">Bonjour {user.name}.</p>}
          </div>
        </div>

        {sessions.length === 0 ? (
          <p className="mt-8 text-center text-sm text-fg-muted">
            Aucune séance ne vous a encore été assignée. Contactez Véronique si vous attendiez un
            accès.
          </p>
        ) : (
          <ul className="mt-8 space-y-2.5">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/client/${s.id}`}
                  className="flex items-center justify-between rounded-sm border border-border bg-bg px-4 py-3.5 transition-colors hover:border-fg"
                >
                  <span className="text-sm">{s.title}</span>
                  <span className="text-xs text-fg-muted">
                    {isSessionLocked(s.status) ? "Sélection soumise" : "En attente de sélection"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <form action={clientLogoutAction} className="mt-8 text-center">
          <button
            type="submit"
            className="text-[13px] text-fg-muted underline underline-offset-[3px] hover:text-fg"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
