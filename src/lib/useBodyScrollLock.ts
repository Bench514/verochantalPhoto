import { useEffect } from "react";

/**
 * Bloque le défilement de la page tant que `locked` est vrai (visionneuse
 * plein écran, menu mobile ouvert...). Le verrou est posé sur <html> et sur
 * <body> : selon le navigateur mobile, c'est l'un ou l'autre qui défile.
 * Les valeurs d'origine sont restaurées à la fermeture.
 */
export function useBodyScrollLock(locked = true) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const { body } = document;
    const previous = [html.style.overflow, body.style.overflow];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      [html.style.overflow, body.style.overflow] = previous;
    };
  }, [locked]);
}
