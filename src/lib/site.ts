import type { Metadata } from "next";

// Identité du site pour le SEO et les aperçus de liens (Open Graph). L'URL
// publique peut être surchargée par NEXT_PUBLIC_SITE_URL (ex. un domaine de
// préproduction), sinon c'est le domaine de production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://verochantalphotographie.ca"
).replace(/\/$/, "");

export const SITE_NAME = "Véronique Chantal Photographie";

export const SITE_TITLE = "Véronique Chantal | Photographie boudoir et portrait";

export const SITE_DESCRIPTION =
  "Photographe boudoir et portrait. Des séances en douceur, à domicile, pour se voir autrement : lumière naturelle, émotions sincères et images sans artifice.";

// Image d'aperçu (logo blanc sur fond noir), servie depuis
// src/app/opengraph-image.png. Le layout la reçoit automatiquement, mais un
// openGraph défini par une page l'efface : pageMetadata la remet donc.
const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Véronique Chantal, photographie boudoir et portrait",
};

/**
 * Métadonnées d'une page publique : titre, description, URL canonique et
 * Open Graph complet. L'objet openGraph d'une page remplace celui du layout
 * (pas de fusion), d'où ce helper qui le reconstruit en entier, image
 * d'aperçu comprise.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Titre court ; le layout ajoute « | Véronique Chantal Photographie ». */
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
  return {
    title: title ?? { absolute: SITE_TITLE },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_CA",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
