import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/Button";

const VALUES = [
  { title: "Douceur", text: "Un rythme adapté à toi, jamais imposé." },
  { title: "Authenticité", text: "Des images qui te ressemblent, sans artifice." },
  { title: "Confidentialité", text: "Tes photos restent privées, sauf si tu décides le contraire." },
];

export default function BioPage() {
  return (
    <>
      <SiteNav active="bio" />
      <section className="px-[6vw] py-20 text-center">
        <h1 className="mx-auto max-w-[1240px] font-name text-[clamp(26px,4.2vw,50px)] font-light italic leading-snug text-fg">
          Entre la personne qu’on a été, celle qu’on est et celle qu’on devient, il existe des
          moments où on mérite d’être vues
        </h1>
      </section>
      <section className="mx-auto flex max-w-[1100px] flex-wrap gap-16 px-[6vw] py-16">
        <div className="relative h-[520px] max-w-[420px] flex-1 min-w-[280px] overflow-hidden rounded-sm bg-bg-alt">
          <Image
            src="/images/vero.jpg"
            alt="Véronique Chantal"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-[280px] flex-1">
          <h2 className="font-signature text-4xl">Bonjour, moi c&apos;est Véronique</h2>
          <p className="mt-3 text-[13px] uppercase tracking-[0.1em] text-fg-muted">
            Photographe portrait &amp; boudoir
          </p>
          <div className="mt-6 space-y-4 text-[15px] font-light leading-[1.8] text-fg">
            <p>
              Moi, c’est Véronique. J’ai commencé à photographier mes amies dans des périodes de transition, souvent au cœur de moments difficiles. Parce qu’au milieu du chaos, on peut facilement oublier qui l’on est. Puis vient un moment où l’on cesse peu à peu de survivre pour recommencer à vivre. À se choisir. À se voir autrement. Je crois que chaque personne a le droit d’être à la fois vulnérable, sensible, élégante, vivante et parfaitement imparfaite.
            </p>
            <p>
              Un jour, j’ai réalisé que je pouvais offrir cette expérience à des femmes et des hommes qui n’osaient pas encore se voir ainsi.
            </p>
            <p>
              Chaque séance commence par une conversation, pas par un appareil photo. Je veux savoir ce qui vous rend nerveux.se, ce qui vous fait du bien et ce que vous aimeriez ressentir en découvrant vos images.

            </p>
            <p>
              Je me déplace chez vous ou dans un AirBnB. On apprivoise l’objectif ensemble, au son de votre musique, à votre rythme. Je suis là pour vous guider, vous mettre à l’aise et créer un espace où vous n’avez rien à prouver. Seulement à être vous. Parce qu’une séance photo, ce n’est pas seulement une collection d’images. C’est aussi une façon de dire : « J’assume plus que jamais la personne que je suis en train de devenir. »
            </p>
          </div>
          <div className="mt-8">
            <Button href="/contact" variant="outline">
              Réservons une séance →
            </Button>
          </div>
        </div>
      </section>

      <section className="px-[6vw] py-16">
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-10 text-center sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h2 className="font-signature text-2xl">{v.title}</h2>
              <p className="mt-2 text-sm text-fg-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
