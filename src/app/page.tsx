import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import CalendlyButton from "@/components/CalendlyButton";
import HeroTriptych from "@/components/HeroTriptych";

const HERO_COLUMNS: [string[], string[], string[]] = [
  [
    "/images/deroulement-preparation.jpg",
    "/images/deroulement-seance.jpg",
    "/images/home-portfolio-1.jpg",
  ],
  [
    "/images/hero.jpg",
    "/images/deroulement-selection.jpg",
    "/images/home-portfolio-2.jpg",
  ],
  [
    "/images/deroulement-livraison.jpg",
    "/images/deroulement-consultation.jpg",
    "/images/home-portfolio-3.jpg",
  ],
];

const SERVICES = [
  {
    title: "Portrait classique",
    desc: "Une séance simple, lumineuse, pour des portraits qui te ressemblent.",
    price: "dès 250 $",
  },
  {
    title: "Séance boudoir",
    desc: "Une expérience intimiste, pensée pour te sentir belle et en confiance.",
    price: "dès 350 $",
    featured: true,
  },
  {
    title: "Forfait duo",
    desc: "Entre amies, en couple — un moment partagé devant la caméra.",
    price: "dès 450 $",
  },
];

const STEPS = [
  { n: "1", text: "On discute de ta vision et de tes envies" },
  { n: "2", text: "Préparation — tenue, lieu, ambiance" },
  { n: "3", text: "Séance détendue, à ton rythme" },
];

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <SiteNav active="accueil" />
        <section className="mx-auto flex w-full max-w-[1800px] flex-1 px-[5vw] py-10 sm:py-14">
          <HeroTriptych
            columns={HERO_COLUMNS}
            centerOverlay={
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(0,0,0,0.5),rgba(0,0,0,0)_72%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <Logo
                    as="h1"
                    shape="lockup"
                    variant="3b"
                    size={56}
                    showServices={false}
                    className="drop-shadow-sm"
                  />
                  <p className="mt-5 max-w-[280px] text-[15px] font-light leading-snug text-on-dark-muted [text-shadow:0_1px_6px_rgba(0,0,0,.4)]">
                    Portraits &amp; séances boudoir — en douceur, sans artifice
                  </p>
                  <div className="mt-7">
                    <Button href="/portfolio" variant="outline-on-dark">
                      Voir le portfolio →
                    </Button>
                  </div>
                </div>
              </>
            }
          />
        </section>
      </div>

      <section className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-14 px-[6vw] py-20">
        <div className="relative h-[200px] w-[200px] shrink-0 overflow-hidden rounded-full bg-bg-alt">
          <Image
            src="/images/vero.jpg"
            alt="Véronique Chantal"
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <div className="max-w-[560px]">
          <p className="text-[13px] uppercase tracking-[0.1em] text-fg-muted">Bonjour</p>
          <p className="mt-4 text-[clamp(17px,2vw,21px)] font-light leading-relaxed">
            Moi c&apos;est Véronique. Je crée des portraits sincères, où l&apos;on se sent
            vue — pas performée. Mon studio est un espace doux, sans jugement, pour celles
            qui veulent se redécouvrir devant l&apos;objectif.
          </p>
          <Link href="/bio" className="mt-5 inline-block border-b border-fg pb-0.5 text-sm">
            En savoir plus sur moi →
          </Link>
        </div>
      </section>

      <section className="px-[6vw] py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[clamp(22px,2.6vw,30px)]">Portfolio</h2>
          <Link href="/portfolio" className="border-b border-fg pb-0.5 text-sm">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["home-portfolio-1", "home-portfolio-2", "home-portfolio-3"].map((img) => (
            <div key={img} className="relative aspect-[4/5] overflow-hidden bg-bg-alt">
              <Image
                src={`/images/${img}.jpg`}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-alt px-[6vw] py-20">
        <h2 className="text-center text-[clamp(22px,2.6vw,30px)]">Services &amp; forfaits</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className={
                "flex min-w-[240px] max-w-[320px] flex-col rounded-sm bg-bg p-9 text-center " +
                (s.featured ? "border border-fg" : "")
              }
            >
              <h3 className="text-lg">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm text-fg-muted">{s.desc}</p>
              <p className="mt-5 text-lg">{s.price}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="border-b border-fg pb-0.5 text-sm">
            Voir tous les forfaits →
          </Link>
        </div>
      </section>

      <section className="px-[6vw] py-20 text-center">
        <h2 className="text-[clamp(22px,2.6vw,30px)]">Déroulement d&apos;une séance</h2>
        <div className="mx-auto mt-10 flex max-w-[700px] flex-wrap justify-center gap-10">
          {STEPS.map((s) => (
            <div key={s.n} className="max-w-[180px]">
              <div className="font-signature text-4xl">{s.n}</div>
              <p className="mt-2 text-sm text-fg-muted">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/deroulement" className="border-b border-fg pb-0.5 text-sm">
            Voir le déroulement complet →
          </Link>
        </div>
      </section>

      <CtaBanner
        title="Prête à vivre l'expérience?"
        text="Réserve directement un créneau ou écris-moi pour qu'on en discute d'abord."
      >
        <CalendlyButton />
        <Button href="/contact" variant="outline-on-dark">
          Envoyer un message
        </Button>
      </CtaBanner>
    </>
  );
}
