import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

// Reproduit design_handoff_footer/footer.snippet.html : le cadre du
// monogramme est une homothétie ×2,7 de celui de l'entête (voir le README de
// ce dossier pour le tableau de proportions), pas la formule générique de
// Logo.tsx — d'où les valeurs en dur plutôt qu'un size passé à <Logo>.
export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg px-[6vw] pt-14 pb-9">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-start justify-between gap-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-7">
          <div
            className="flex flex-shrink-0 flex-col items-center border border-fg"
            style={{ padding: "24px 35px 22px", gap: 19 }}
          >
            <span
              className="font-monogram leading-none tracking-[.08em] text-fg"
              style={{ fontSize: 59 }}
            >
              VC
            </span>
            <span className="block bg-fg" style={{ height: 3, width: 49 }} />
          </div>
          <div className="flex flex-col gap-[11px]">
            <span
              className="font-name italic font-light leading-none text-fg"
              style={{ fontSize: 38 }}
            >
              Véro Chantal
            </span>
            <span className="pl-[.5em] text-[11px] font-light uppercase tracking-[.5em] text-fg-muted">
              Photographe
            </span>
            <span className="whitespace-nowrap pl-[.3em] text-[9px] font-light uppercase tracking-[.3em] text-fg-muted">
              Boudoir &middot; Portrait &middot; Couple
            </span>
            <span className="mt-[10px] text-[12px] text-fg-muted">veroniquechantalphoto.ca</span>
          </div>
        </div>
        <ul className="flex flex-wrap gap-5 text-[11px] uppercase tracking-[.08em] text-fg-muted">
          {NAV_LINKS.filter((l) => l.key !== "accueil").map((link) => (
            <li key={link.key}>
              <Link href={link.href} className="hover:text-fg">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-9 max-w-[1100px] border-t border-border pt-[18px] text-[11px] text-fg-muted">
        © {new Date().getFullYear()} Véro Chantal Photographe
      </div>
    </footer>
  );
}
