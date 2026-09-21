"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";

const INTERVAL_MS = 10000;
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

function Panel({
  images,
  offsetMs,
  overlay,
}: {
  images: string[];
  offsetMs: number;
  overlay?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL_MS);
    }, offsetMs);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [images.length, offsetMs]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`relative h-full flex-1 min-w-0 overflow-hidden transition-opacity ease-out ${
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
          sizes="34vw"
          priority={i === 0}
          className={`object-cover transition-opacity ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
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

  useEffect(() => {
    const raf = requestAnimationFrame(() => setCrossfaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`relative flex w-full ${className}`}>
      <Panel images={columns[0]} offsetMs={0} />
      <Panel images={columns[1]} offsetMs={STAGGER_MS} overlay={centerOverlay} />
      <Panel images={columns[2]} offsetMs={STAGGER_MS * 2} />
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
