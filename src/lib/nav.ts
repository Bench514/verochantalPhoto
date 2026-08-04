export const NAV_LINKS = [
  { href: "/", label: "Accueil", key: "accueil" },
  { href: "/portfolio", label: "Portfolio", key: "portfolio" },
  { href: "/services", label: "Services", key: "services" },
  { href: "/deroulement", label: "Déroulement", key: "deroulement" },
  { href: "/bio", label: "Bio", key: "bio" },
  { href: "/contact", label: "Contact", key: "contact" },
] as const;

export type NavKey = (typeof NAV_LINKS)[number]["key"];
