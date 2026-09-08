import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="bg-bg-alt">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-8 px-[6vw] py-14">
        <div className="flex flex-col items-center gap-2">
          <Logo shape="lockup" size={44} showServices={false} />
          <div className="text-sm text-fg-muted">veroniquechantalphoto.ca</div>
        </div>
        <ul className="flex flex-wrap gap-6 text-[13px] text-fg-muted">
          {NAV_LINKS.filter((l) => l.key !== "accueil").map((link) => (
            <li key={link.key}>
              <Link href={link.href} className="hover:text-fg">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border px-[6vw] py-4 text-center text-xs text-fg-muted">
        © {new Date().getFullYear()} Véronique Chantal Photo
      </div>
    </footer>
  );
}
