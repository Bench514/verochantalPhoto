"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";

const INTERVAL_MS = 7000;
const STAGGER_MS = 1000;

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

  return (
    <div className="relative h-full flex-1 min-w-0 overflow-hidden">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="34vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
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
 */
export default function HeroTriptych({
  columns,
  centerOverlay,
  className = "",
}: {
  columns: [string[], string[], string[]];
  centerOverlay?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex w-full ${className}`}>
      <Panel images={columns[0]} offsetMs={0} />
      <Panel images={columns[1]} offsetMs={STAGGER_MS} overlay={centerOverlay} />
      <Panel images={columns[2]} offsetMs={STAGGER_MS * 2} />
    </div>
  );
}
