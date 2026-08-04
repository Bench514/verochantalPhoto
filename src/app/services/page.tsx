import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import CalendlyButton from "@/components/CalendlyButton";

const SERVICES = [
  {
    title: "Portrait classique",
    desc: "Une séance simple, lumineuse, pour des portraits qui te ressemblent.",
    price: "dès 250 $",
    details: ["1h", "2 tenues", "15 photos retouchées", "Galerie privée"],
  },
  {
    title: "Séance boudoir",
    desc: "Une expérience intimiste, pensée pour te sentir belle et en confiance.",
    price: "dès 350 $",
    details: [
      "1h30",
      "Accompagnement pose & style",
      "20 photos retouchées",
      "Galerie confidentielle",
    ],
    featured: true,
  },
  {
    title: "Forfait duo",
    desc: "Entre amies, en couple — un moment partagé devant la caméra.",
    price: "dès 450 $",
    details: ["1h30", "2 personnes", "25 photos retouchées", "Galerie privée"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <SiteNav active="services" />
      <section className="px-[6vw] py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <h1 className="text-[clamp(28px,3.4vw,40px)]">Services &amp; forfaits</h1>
          <p className="mt-3 text-fg-muted">
            Chaque forfait comprend une consultation avant la séance et une galerie privée
            en ligne.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className={
                "flex min-w-[260px] max-w-[340px] flex-col rounded-sm p-9 " +
                (s.featured ? "border border-fg" : "bg-bg-alt")
              }
            >
              {s.featured && (
                <span className="mb-3 inline-block self-start rounded-sm border border-fg px-2 py-0.5 text-[11px] uppercase tracking-[0.06em]">
                  Populaire
                </span>
              )}
              <h2 className="text-lg">{s.title}</h2>
              <p className="mt-2 text-sm text-fg-muted">{s.desc}</p>
              <ul className="mt-5 space-y-1.5 text-sm text-fg-muted">
                {s.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <p className="text-lg">{s.price}</p>
                <div className="mt-4">
                  <Button href="/contact" variant="outline">
                    Réserver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-fg-muted">
          Besoin de quelque chose de différent?{" "}
          <Link href="/contact" className="border-b border-fg pb-0.5 text-fg">
            Écris-moi pour un forfait personnalisé →
          </Link>
        </p>
      </section>

      <CtaBanner title="Prête à choisir ton forfait?">
        <CalendlyButton />
        <Button href="/contact" variant="outline-on-dark">
          Envoyer un message
        </Button>
      </CtaBanner>
    </>
  );
}
