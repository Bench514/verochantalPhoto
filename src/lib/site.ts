import type { Metadata } from "next";

// Identité du site pour le SEO et les aperçus de liens (Open Graph). L'URL
// publique peut être surchargée par NEXT_PUBLIC_SITE_URL (ex. un domaine de
// préproduction), sinon c'est le domaine de production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://verochantalphotographie.ca"
).replace(/\/$/, "");

// Base des liens envoyés par courriel (invitation client, notifications).
// Par défaut le vrai site; APP_BASE_URL permet de la surcharger (ex. en local).
export const APP_BASE_URL = (process.env.APP_BASE_URL || SITE_URL).replace(/\/$/, "");

export const SITE_DOMAIN = "verochantalphotographie.ca";

export const SITE_NAME = "Véronique Chantal Photographie";

// Courriel public (page Contact, portail client, données structurées).
// NEXT_PUBLIC_CONTACT_EMAIL sur Railway a priorité s'il est défini.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@verochantalphotographie.ca";

// Région desservie, affichée dans le footer et sur la page Contact, et
// déclarée aux moteurs de recherche (description, données structurées).
export const SERVICE_AREAS = ["Montréal et les environs", "Laurentides", "Lanaudière"];

export const SITE_TITLE =
  "Véronique Chantal | Photographe boudoir et portrait à Montréal";

export const SITE_DESCRIPTION =
  "Photographe boudoir et portrait à Montréal, dans les Laurentides et Lanaudière. Des séances en douceur, à domicile : lumière naturelle et images sans artifice.";

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
