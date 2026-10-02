import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import CalendlyButton from "@/components/CalendlyButton";
import HeroTriptych from "@/components/HeroTriptych";
import FadeInSection from "@/components/FadeInSection";
import { PACKAGES } from "@/lib/packages";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  pageMetadata,
} from "@/lib/site";
import TestimonialsSlider from "@/components/TestimonialsSlider";

export const metadata = pageMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
});

// Données structurées (schema.org) : décrivent l'entreprise aux moteurs de
// recherche. Contenu statique, échappé quand même comme le recommande Next.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  alternateName: "Véro Chantal Photographe",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.png`,
  logo: `${SITE_URL}/icon.png`,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bonjour@veroniquechantalphoto.ca",
  priceRange: "$$",
  knowsAbout: ["Photographie boudoir", "Photographie portrait"],
};

const HERO_COLUMNS: [string[], string[], string[]] = [
  ["/images/carousel-1.jpg", "/images/carousel-2.jpg", "/images/carousel-3.jpg"],
  ["/images/carousel-4.jpg", "/images/carousel-5.jpg", "/images/carousel-6.jpg"],
  ["/images/carousel-7.jpg", "/images/carousel-8.jpg", "/images/carousel-9.jpg"],
];

// Trois forfaits mis en avant sur l'accueil, en ordre décroissant de valeur.
// Titres, prix et mise en avant viennent de PACKAGES (source unique avec
// /services) ; seule l'accroche courte est propre à l'accueil.
const SERVICES = [
  {
    key: "briller",
    desc: "Une expérience complète et immersive pour rayonner en toute confiance.",
  },
  {
    key: "saffirmer",
    desc: "Le temps de deux tenues pour prendre ta place et te révéler avec assurance.",
  },
  {
    key: "oser",
    desc: "Une première expérience en douceur, pour oser se voir autrement.",
  },
].map(({ key, desc }) => {
  const pkg = PACKAGES.find((p) => p.key === key)!;
  return { title: pkg.title, price: pkg.price, featured: pkg.featured, desc };
});

const STEPS = [
  { n: "1", text: "On discute de ta vision et de tes envies" },
  { n: "2", text: "Préparation — tenue, lieu, ambiance" },
  { n: "3", text: "Séance détendue, à ton rythme" },
];

const TESTIMONIALS = [
  {
    quote:
      "Je suis arrivée nerveuse, mais Véronique m'a rapidement mise en confiance. Je me suis permise d'être forte et vulnérable, fière et reconnectée à moi-même malgré la caméra.",
    author: "M-C. H., 49 ans",
  },
  {
    quote:
      "J'avais peur d'être photographiée, mais je me suis sentie vue, comprise et mise en valeur à chaque instant.",
    author: "G.A., 41 ans",
  },
  {
    quote:
      "Cette séance m'a permis d'honorer un grand tournant de ma vie avec douceur, fierté et beaucoup d'émotions.",
    author: "P. F-P., 52 ans",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex min-h-screen flex-col">
        <SiteNav active="accueil" />
        <section className="mx-auto flex w-full max-w-[1800px] flex-1 md:px-[5vw] md:py-14">
          <HeroTriptych
            columns={HERO_COLUMNS}
            introOverlay={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg px-6 text-center">
                <Logo
                  shape="lockup"
                  variant="3a"
                  size={56}
                  showServices={false}
                />
                <p className="mt-5 max-w-[280px] text-[15px] font-light leading-snug text-fg-muted">
                  Portraits &amp; séances boudoir — en douceur, sans artifice
                </p>
                <div className="mt-7">
                  <Button href="/portfolio" variant="outline">
                    Voir le portfolio →
                  </Button>
                </div>
              </div>
            }
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

      <FadeInSection as="section" className="mx-auto flex max-w-[1100px] flex-col gap-14 px-[6vw] py-20 md:flex-row md:flex-wrap md:items-center">
        <div className="relative h-[200px] w-[200px] shrink-0 self-end overflow-hidden rounded-full bg-bg-alt md:self-auto">
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
            Moi, c’est Véronique. Je capture bien plus qu’une image : je crée une expérience où vous vous sentez belle, guidée et pleinement vous-même. À travers la lumière naturelle, les détails du quotidien et les émotions sincères, je raconte votre histoire avec authenticité.
          </p>
          <Link href="/bio" className="mt-5 inline-block border-b border-fg pb-0.5 text-sm">
            En savoir plus sur moi →
          </Link>
        </div>
      </FadeInSection>

      <FadeInSection as="section" className="px-[6vw] py-16">
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
      </FadeInSection>

      <FadeInSection as="section" className="bg-bg-alt px-[6vw] py-20">
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
      </FadeInSection>

      <FadeInSection as="section" className="px-[6vw] py-20 text-center">
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
      </FadeInSection>

      <FadeInSection as="section" className="bg-bg-alt px-[6vw] py-20">
        <h2 className="text-center text-[clamp(22px,2.6vw,30px)]">Témoignages</h2>
        <TestimonialsSlider testimonials={TESTIMONIALS} />
      </FadeInSection>

      <FadeInSection>
        <CtaBanner
          tall
          title="Prête à vivre l'expérience?"
          text="Réserve directement un créneau ou écris-moi pour qu'on en discute d'abord."
        >
          <CalendlyButton />
          <Button href="/contact" variant="outline-on-dark">
            Envoyer un message
          </Button>
        </CtaBanner>
      </FadeInSection>
    </>
  );
}
