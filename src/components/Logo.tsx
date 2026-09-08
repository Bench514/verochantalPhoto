import type { ElementType } from "react";

// Lockup Véro Chantal — planches 3A (encre foncée / fond clair) et 3B (encre
// claire / fond sombre). Voir design_handoff_logo_vero_chantal/README.md pour
// les proportions et ratios d'origine.
type Variant = "3a" | "3b";
type Shape = "monogram" | "lockup" | "watermark";

const INK: Record<Variant, { text: string; border: string; rule: string; baseline: string; services: string }> = {
  "3a": {
    text: "text-fg",
    border: "border-fg/40",
    rule: "bg-fg/40",
    baseline: "text-vc-baseline",
    services: "text-vc-services",
  },
  "3b": {
    text: "text-on-dark",
    border: "border-on-dark/50",
    rule: "bg-on-dark/50",
    baseline: "text-vc-baseline-on-dark",
    services: "text-vc-services-on-dark",
  },
};

function Monogram({
  variant,
  size,
  className = "",
}: {
  variant: Variant;
  size: number;
  className?: string;
}) {
  const ink = INK[variant];
  return (
    <span
      className={`inline-flex flex-col items-center border ${ink.border} ${className}`}
      style={{
        gap: size * 0.2,
        padding: `${size * 0.43}px ${size * 0.61}px ${size * 0.39}px`,
      }}
    >
      <span
        className={`font-monogram leading-none tracking-[.08em] ${ink.text}`}
        style={{ fontSize: size }}
      >
        VC
      </span>
      <span className={`block ${ink.rule}`} style={{ height: 1, width: size * 0.83 }} />
    </span>
  );
}

function Lockup({
  as: Comp = "div",
  variant,
  nameSize,
  showBaseline,
  showServices,
  className = "",
}: {
  as?: ElementType;
  variant: Variant;
  nameSize: number;
  showBaseline: boolean;
  showServices: boolean;
  className?: string;
}) {
  const ink = INK[variant];
  return (
    <Comp className={`flex flex-col items-center gap-6 ${className}`}>
      <Monogram variant={variant} size={nameSize * 0.79} />
      <span className="flex flex-col items-center gap-[11px]">
        <span
          className={`font-name italic font-light leading-none ${ink.text}`}
          style={{ fontSize: nameSize }}
        >
          Véro Chantal
        </span>
        {showBaseline && (
          <span
            className={`font-sans font-light uppercase tracking-[.5em] pl-[.5em] ${ink.baseline}`}
            style={{ fontSize: nameSize * 0.17 }}
          >
            Photographe
          </span>
        )}
        {showServices && (
          <span
            className={`font-sans font-light uppercase tracking-[.3em] pl-[.3em] ${ink.services}`}
            style={{ fontSize: nameSize * 0.15 }}
          >
            Boudoir &middot; Portrait &middot; Couple
          </span>
        )}
      </span>
    </Comp>
  );
}

function Watermark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-name italic font-light leading-none text-white [text-shadow:0_1px_6px_rgba(0,0,0,.4)] ${className}`}
      style={{ fontSize: 20 }}
    >
      Véro Chantal
    </span>
  );
}

/**
 * Lockup typographique Véro Chantal. Voir
 * design_handoff_logo_vero_chantal/README.md pour l'anatomie complète.
 */
export default function Logo({
  shape,
  variant = "3a",
  size,
  as,
  showBaseline = true,
  showServices = true,
  className = "",
}: {
  shape: Shape;
  variant?: Variant;
  /** Taille du "VC" pour shape="monogram", du nom pour shape="lockup". */
  size?: number;
  /** Élément racine pour shape="lockup" (ex. "h1" pour le hero d'accueil). */
  as?: ElementType;
  showBaseline?: boolean;
  showServices?: boolean;
  className?: string;
}) {
  if (shape === "watermark") return <Watermark className={className} />;
  if (shape === "monogram") return <Monogram variant={variant} size={size ?? 22} className={className} />;
  return (
    <Lockup
      as={as}
      variant={variant}
      nameSize={size ?? 52}
      showBaseline={showBaseline}
      showServices={showServices}
      className={className}
    />
  );
}
