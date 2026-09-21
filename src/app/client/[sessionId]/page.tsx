import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";
import { clientLogoutAction } from "../actions";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import { isSessionLocked } from "@/lib/types";

function daysLeft(expiresAt: Date | null): number | null {
  if (!expiresAt) return null;
  const ms = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

const HOW_IT_WORKS = [
  {
    n: 1,
    title: "Regardez toutes vos photos",
    text: "La galerie contient l'ensemble des photos de votre séance, non retouchées. Cliquez sur une photo pour l'agrandir et bien la voir.",
    checks: [] as number[],
  },
  {
    n: 2,
    title: "Cochez vos préférées",
    text: "Un clic sur la pastille ajoute la photo à votre sélection. Rien n'est définitif : vous pouvez en retirer et en ajouter à tout moment.",
    checks: [1, 3],
  },
  {
    n: 3,
    title: "Confirmez votre sélection",
    text: "Quand votre sélection vous convient, vous la validez. Véronique reçoit votre liste et commence la retouche des photos choisies.",
    checks: [] as number[],
  },
];

export default async function EspaceClientPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userId = await getClientUserId();

  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: { client: true, photos: { orderBy: { createdAt: "asc" } } },
  });
  if (!session || session.clientId !== userId) notFound();

  const sessionCount = await prisma.photoSession.count({ where: { clientId: session.clientId } });

  const expired = !!session.expiresAt && session.expiresAt < new Date();
  const locked = isSessionLocked(session.status);
  const sessionName = session.client.name || session.client.email;
  const photoCount = session.photos.length;
  const selectedCount = session.photos.filter((p) => p.selected).length;
  const cover =
    session.photos.find((p) => p.id === session.coverPhotoId) || session.photos[0];
  const remaining = daysLeft(session.expiresAt);
  const sessionDateLabel = session.sessionDate.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bonjour@veroniquechantalphoto.ca";
  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `Ma séance du ${sessionDateLabel}`
  )}`;

  return (
    <div className="bg-bg">
      <header className="relative z-[5] flex items-center justify-between border-b border-border bg-bg px-[6vw] py-5">
        <Link
          href="/"
          aria-label="Véro Chantal Photographe — accueil"
          className="inline-flex flex-col items-center gap-1.5"
        >
          <Logo shape="monogram" />
        </Link>
        <div className="flex items-center gap-[22px] text-[13px] text-fg-muted">
          {sessionCount > 1 && (
            <Link href="/client" className="text-[11px] uppercase tracking-[0.08em] text-fg-muted hover:text-fg">
              ← Toutes mes séances
            </Link>
          )}
          <span>{session.client.email}</span>
          <form action={clientLogoutAction}>
            <button
              type="submit"
              className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.06em] text-fg hover:bg-fg hover:text-bg"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="relative flex min-h-[62vh] items-end overflow-hidden">
        {cover ? (
          <Image
            src={`/session-photos/${cover.id}`}
            alt=""
            fill
            unoptimized
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-bg-alt" />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(25,24,22,.2) 0%, rgba(25,24,22,.55) 45%, rgba(25,24,22,.88) 100%)",
          }}
        />
        <div className="relative w-full px-[6vw] pb-14">
          <div className="mx-auto max-w-[1100px]">
            <div className="font-name text-[clamp(26px,3.2vw,40px)] leading-none text-on-dark">
              {sessionName}
            </div>
            <div className="mt-[18px] inline-block rounded-sm border border-on-dark/50 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.1em] text-on-dark">
              Séance du {sessionDateLabel}
            </div>
            <div className="mt-3.5 text-[clamp(30px,4.4vw,52px)] font-light leading-[1.15] text-on-dark">
              {locked ? "Votre sélection est enregistrée." : "Vos photos sont prêtes."}
            </div>
            <p className="mt-3.5 max-w-[620px] text-[clamp(15px,1.7vw,19px)] font-light leading-[1.6] text-on-dark">
              {locked
                ? `${selectedCount} photo(s) confirmée(s). Véronique a été prévenue et commence la retouche.`
                : "Prenez le temps de les regarder, puis choisissez celles que vous souhaitez faire retoucher. Tout se fait ici, en trois étapes."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href={`/client/${session.id}/galerie`} variant="invert">
                {locked ? "Voir ma sélection" : `Voir mes ${photoCount} photos`}
              </Button>
              {!locked && (
                <a
                  href="#comment"
                  className="border-b border-on-dark/45 pb-[3px] text-[13px] tracking-[0.06em] text-on-dark"
                >
                  Comment ça marche ?
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] -translate-y-8 px-[6vw]">
        <div className="flex flex-wrap items-center gap-8 rounded-sm border border-border bg-bg px-8 py-7">
          <div className="min-w-[240px] flex-1">
            <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-fg-muted">
              Votre séance
            </div>
            <div className="mb-1.5 text-xl">{session.title}</div>
            <div className="text-[13px] text-fg-muted">
              {photoCount} photo{photoCount > 1 ? "s" : ""} à découvrir · {session.includedCount}{" "}
              retouches incluses à votre forfait
            </div>
          </div>
          <div className="min-w-[180px] flex-none border-l border-border pl-8">
            <div className="mb-2.5 text-[11px] uppercase tracking-[0.1em] text-fg-muted">
              Sélection en cours
            </div>
            <div className="mb-3 flex items-baseline gap-1.5">
              <span className="text-[26px] font-light">{selectedCount}</span>
              <span className="text-sm text-fg-muted">/ {session.includedCount} choisies</span>
            </div>
            <div className="h-[3px] overflow-hidden bg-border">
              <div
                className="h-full bg-fg transition-[width] duration-200 ease-out"
                style={{
                  width: `${Math.min(100, (selectedCount / session.includedCount) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="min-w-[150px] flex-none">
            <div className="inline-flex items-center gap-2 rounded-sm border border-border px-3.5 py-2 text-xs text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-fg" />
              {expired
                ? "Accès expiré"
                : remaining === null
                  ? "Aucune limite de temps"
                  : `Il vous reste ${remaining} jour${remaining > 1 ? "s" : ""}`}
            </div>
          </div>
        </div>
      </div>

      {expired && (
        <div className="mx-auto max-w-[1100px] px-[6vw] pt-8 text-sm text-fg-muted">
          L&rsquo;accès à cette séance a expiré. Contactez Véronique si vous avez besoin d&rsquo;y
          accéder à nouveau.
        </div>
      )}

      <div id="comment" className="mx-auto max-w-[1100px] px-[6vw] pb-24 pt-12">
        <h2 className="font-signature text-4xl leading-[1.1]">Comment ça marche</h2>
        <p className="mb-[52px] mt-3 max-w-[560px] text-[15px] leading-[1.6] text-fg-muted">
          Trois étapes, aucune urgence. Vous pouvez revenir sur cette page autant de fois que vous
          le souhaitez avant de confirmer.
        </p>

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.n}>
              <div className="mb-[22px] rounded-sm bg-bg-alt p-[22px]">
                <div className="grid grid-cols-3 gap-1.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative h-11 rounded-sm bg-border"
                    >
                      {step.checks.includes(i) && (
                        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-fg text-[9px] text-bg">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-2.5 flex items-baseline gap-3">
                <span className="font-signature text-4xl leading-none">{step.n}</span>
                <span className="text-lg">{step.title}</span>
              </div>
              <p className="text-sm leading-[1.65] text-fg-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-alt px-[6vw] py-20">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-y-9 gap-x-12 sm:grid-cols-2">
          <h2 className="font-signature text-4xl leading-[1.1] sm:col-span-2">Bon à savoir</h2>

          <div>
            <div className="mb-2 text-base">Combien de photos puis-je choisir ?</div>
            <p className="text-sm leading-[1.65] text-fg-muted">
              Le nombre de retouches incluses dépend de votre forfait. Pour votre séance, c&rsquo;est{" "}
              {session.includedCount} photos. Vous pouvez en ajouter d&rsquo;autres après coup,
              Véronique vous indiquera le tarif.
            </p>
          </div>

          <div>
            <div className="mb-2 text-base">Jusqu&rsquo;à quand puis-je choisir ?</div>
            <p className="text-sm leading-[1.65] text-fg-muted">
              {remaining === null
                ? "Votre galerie reste accessible sans limite de temps particulière."
                : `Votre galerie reste accessible ${remaining} jour${remaining > 1 ? "s" : ""} encore.`}{" "}
              Le délai varie selon le forfait ; si vous avez besoin de plus de temps, écrivez
              simplement à Véronique.
            </p>
          </div>

          <div>
            <div className="mb-2 text-base">Les photos sont-elles déjà retouchées ?</div>
            <p className="text-sm leading-[1.65] text-fg-muted">
              Non. Ce que vous voyez est la sélection brute, corrigée en lumière et en couleur
              seulement. La retouche fine se fait après votre choix.
            </p>
          </div>

          <div>
            <div className="mb-2 text-base">Et après avoir confirmé ?</div>
            <p className="text-sm leading-[1.65] text-fg-muted">
              Vous recevez un courriel de confirmation. Les fichiers haute résolution arrivent dans
              cette même galerie, prêts à télécharger.
            </p>
          </div>

          <div>
            <div className="mb-2 text-base">Puis-je partager le lien ?</div>
            <p className="text-sm leading-[1.65] text-fg-muted">
              Il est personnel, mais rien ne vous empêche de regarder les photos avec quelqu&rsquo;un
              en qui vous avez confiance avant de décider.
            </p>
          </div>

          <div>
            <div className="mb-2 text-base">J&rsquo;hésite entre deux photos</div>
            <p className="text-sm leading-[1.65] text-fg-muted">
              Cochez les deux et revenez plus tard. Tant que vous n&rsquo;avez pas confirmé, votre
              sélection reste modifiable.
            </p>
          </div>
        </div>
      </div>

      <CtaBanner
        title="Passons à la sélection"
        text="Une question, un doute, une envie particulière pour la retouche : écrivez-moi, je réponds vite."
      >
        <Button href={`/client/${session.id}/galerie`} variant="invert">
          Ouvrir ma galerie
        </Button>
        <Button href={mailto} variant="outline-on-dark" external>
          Écrire à Véronique
        </Button>
      </CtaBanner>
    </div>
  );
}
