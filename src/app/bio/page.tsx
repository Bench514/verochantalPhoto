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
      <section className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-16 px-[6vw] py-16">
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
          <h1 className="font-signature text-4xl">Bonjour, moi c&apos;est Véronique</h1>
          <p className="mt-3 text-[13px] uppercase tracking-[0.1em] text-fg-muted">
            Photographe portrait &amp; boudoir
          </p>
          <div className="mt-6 space-y-4 text-[15px] font-light leading-[1.8] text-fg">
            <p>
              J&apos;ai commencé la photographie pour capturer ce que je voyais chez les
              gens que j&apos;aimais — une lumière, une posture, un regard — avant de
              réaliser que je pouvais offrir la même chose à des inconnues qui n&apos;osaient
              pas encore se voir ainsi.
            </p>
            <p>
              Chaque séance commence par une conversation, pas par un appareil photo. Je
              veux savoir ce qui te rend nerveuse, ce qui te fait du bien, et ce que tu
              espères ressentir en voyant les photos.
            </p>
            <p>
              Mon studio est pensé comme un espace sans jugement — la musique que tu aimes,
              le temps qu&apos;il te faut, et une présence qui ne cherche jamais à te
              rendre autre que ce que tu es déjà.
            </p>
          </div>
          <div className="mt-8">
            <Button href="/contact" variant="outline">
              Réservons une séance →
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt px-[6vw] py-16">
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
