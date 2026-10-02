"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";

const INTERVAL_MS = 10000;
// En mobile, un seul carrousel tourne : un rythme plus soutenu évite que la
// page paraisse figée.
const MOBILE_INTERVAL_MS = 6000;
const STAGGER_MS = 400;

// La révélation (fondu d'apparition) des panneaux est distincte du décalage
// du carrousel : elle démarre seulement quand `introOverlay` commence lui-même
// à s'estomper (REVEAL_START_MS = son délai), sans quoi un panneau termine son
// fondu pendant qu'il est encore caché sous l'overlay opaque et "apparaît" en
// un coup sec dès que l'overlay se dissipe. Les trois panneaux se révèlent
// ensemble (pas de décalage entre eux), en un seul fondu synchronisé avec
// celui de l'overlay.
const REVEAL_START_MS = STAGGER_MS;
const REVEAL_DURATION_MS = 1000;
const CROSSFADE_DURATION_MS = 2000;

// Même breakpoint que `md:` (48rem) : en dessous, le triptyque devient un
// carrousel unique pleine largeur.
const MOBILE_QUERY = "(max-width: 47.99rem)";

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Côté serveur (et pendant l'hydratation) on suppose le desktop : le panneau
// central affiche alors sa propre colonne, dont la première photo est aussi
// la première du carrousel mobile, donc aucun saut visible au basculement.
function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

// Colonnes latérales masquées en mobile : "1px" pousse le navigateur vers la
// plus petite variante, au cas où il charge quand même l'image prioritaire.
const SIDE_SIZES = "(max-width: 47.99rem) 1px, 34vw";

function Panel({
  images,
  offsetMs,
  overlay,
  intervalMs = INTERVAL_MS,
  sizes,
  className = "",
}: {
  images: string[];
  offsetMs: number;
  overlay?: ReactNode;
  intervalMs?: number;
  sizes: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    }, offsetMs);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [images.length, offsetMs, intervalMs]);

  // Le nombre de photos change au passage mobile/desktop : on garde un index
  // valide.
  const current = index % images.length;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`relative h-full flex-1 min-w-0 overflow-hidden transition-opacity ease-out ${className} ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDelay: `${REVEAL_START_MS}ms`, transitionDuration: `${REVEAL_DURATION_MS}ms` }}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={i === 0}
          className={`object-cover transition-opacity ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: `${CROSSFADE_DURATION_MS}ms` }}
        />
      ))}
      {overlay}
    </div>
  );
}

/**
 * Bande "triptyque" du hero d'accueil : trois colonnes accolées (sans gap),
 * chacune un carrousel autonome (3 photos, 7s d'intervalle), avec un
 * décalage d'1s d'une colonne à l'autre pour un effet de cascade.
 *
 * En mobile (sous md), les colonnes latérales sont masquées et le panneau
 * central, qui porte `centerOverlay`, passe en pleine largeur et fait défiler
 * les neuf photos : logo, phrase et CTA restent ainsi toujours centrés.
 *
 * Au tout premier affichage, les photos (et donc `centerOverlay`, pensé pour
 * un fond sombre) sont encore invisibles. `introOverlay` — une version du
 * même contenu en encre foncée — reste visible sur le fond clair pendant ce
 * délai, puis s'estompe en même temps que `centerOverlay` apparaît, pour un
 * fondu enchaîné plutôt qu'un flash de texte illisible.
 */
export default function HeroTriptych({
  columns,
  centerOverlay,
  introOverlay,
  className = "",
}: {
  columns: [string[], string[], string[]];
  centerOverlay?: ReactNode;
  introOverlay?: ReactNode;
  className?: string;
}) {
  const [crossfaded, setCrossfaded] = useState(false);
  const isMobile = useIsMobile();

  // Ordre du carrousel mobile : on alterne les colonnes (centre, gauche,
  // droite) pour varier les séances d'une photo à l'autre.
  const mobileImages = columns[1].flatMap((src, i) => [
    src,
    ...[columns[0][i], columns[2][i]].filter(Boolean),
  ]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setCrossfaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`relative flex w-full ${className}`}>
      <Panel
        images={columns[0]}
        offsetMs={0}
        sizes={SIDE_SIZES}
        className="hidden md:block"
      />
      <Panel
        images={isMobile ? mobileImages : columns[1]}
        offsetMs={isMobile ? 0 : STAGGER_MS}
        intervalMs={isMobile ? MOBILE_INTERVAL_MS : INTERVAL_MS}
        sizes="(max-width: 47.99rem) 100vw, 34vw"
        overlay={centerOverlay}
      />
      <Panel
        images={columns[2]}
        offsetMs={STAGGER_MS * 2}
        sizes={SIDE_SIZES}
        className="hidden md:block"
      />
      {introOverlay && (
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out ${
            crossfaded ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDelay: `${STAGGER_MS}ms` }}
        >
          {introOverlay}
        </div>
      )}
    </div>
  );
}
