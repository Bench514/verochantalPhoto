// Source unique des forfaits proposés sur /services. Le formulaire de
// création de séance (admin) s'en sert pour pré-remplir le titre et le
// nombre de retouches incluses — ces champs restent éditables ensuite pour
// les ententes personnalisées négociées avec Véronique.
export type Package = {
  key: string;
  title: string;
  price: string;
  includedCount: number;
  details: string[];
  featured?: boolean;
};

export const PACKAGES: Package[] = [
  {
    key: "rayonner",
    title: `L'expérience "Rayonner"`,
    price: "dès 1450 $",
    includedCount: 40,
    details: [
      "Séance à domicile: jusqu’à 6h",
      "Service de coiffure et de maquillage",
      "6 à 8 tenues",
      "40 photos retouchées (format web et haute résolution)",
      "Galerie privée illimitée",
      "Album photo incluant les photos retouchées",
      "Laisser-passer au spa ",
    ],
  },
  {
    key: "briller",
    title: `L'expérience "Briller"`,
    price: "dès 925 $",
    includedCount: 25,
    details: [
      "Séance à domicile: jusqu’à 4h",
      "3 à 5 tenues",
      "25 photos retouchées (format web et haute résolution)",
      "Galerie privée illimitée",
      "2 imprimés de vos photos préférées",
    ],
    featured: true,
  },
  {
    key: "saffirmer",
    title: `L'expérience "S'affirmer"`,
    price: "dès 575 $",
    includedCount: 15,
    details: [
      "Séance à domicile entre 90 minutes et 2h30",
      "2 tenues",
      "15 photos retouchées (format web et haute résolution)",
      "Galerie privée d'une durée de 6 mois",
    ],
  },
  {
    key: "oser",
    title: `L'expérience "Oser"`,
    price: "dès 325 $",
    includedCount: 5,
    details: [
      "Séance à domicile de 60 minutes à 90 minutes",
      "1 tenue",
      "5 photos retouchées (format web et haute résolution)",
      "Galerie privée d'une durée de 3 mois",
    ],
  },
];
