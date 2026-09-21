import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "outline-on-dark" | "invert";

const VARIANT_CLASSES: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:opacity-85",
  outline: "border border-fg text-fg hover:bg-fg hover:text-bg",
  "outline-on-dark":
    "border border-on-dark text-on-dark hover:bg-on-dark hover:text-dark",
  // Bouton "solid" inversé pour une utilisation sur fond sombre (héros,
  // bandeaux CTA) — fond clair, texte foncé.
  invert: "bg-bg text-fg hover:opacity-85",
};

export default function Button({
  href,
  children,
  variant = "solid",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
}) {
  const className =
    "inline-flex items-center justify-center rounded-sm px-6 py-3 text-[13px] tracking-[0.03em] transition-colors " +
    VARIANT_CLASSES[variant];
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
