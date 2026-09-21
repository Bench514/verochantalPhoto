import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import CalendlyButton from "@/components/CalendlyButton";

const STEPS = [
  {
    n: "1",
    title: "Consultation",
    text: "On échange par téléphone sur tes envies, tes craintes et ce qui te donne envie de vivre cette expérience. Je veux aussi savoir ce qui pourrait te mettre à l’aise et te permettre de te sentir en confiance.",
    img: "deroulement-consultation",
  },
  {
    n: "2",
    title: "Préparation",
    text: "On prend le temps de réfléchir ensemble au lieu, aux tenues et à l’ambiance que tu souhaites créer. L’objectif : que tout soit clair et que tu arrives le jour de la séance en confiance, sans pression.",
    img: "deroulement-preparation",
  },
  {
    n: "3",
    title: "La séance",
    text: (
      <>
        On avance à ton rythme, au son de ta musique et dans la bienveillance. Je te guide
        du début à la fin, sans jamais imposer une pose.{" "}
        <strong>Tu demeures maître de ton niveau de dévoilement, à chaque instant.</strong>
      </>
    ),
    img: "deroulement-seance",
  },
  {
    n: "4",
    title: "Sélection",
    text: "Après la séance, tu reçois une galerie privée en ligne où tu peux prendre le temps de choisir tes images préférées. Tu disposes d’une semaine pour faire ta sélection.",
    img: "deroulement-selection",
  },
  {
    n: "5",
    title: "Livraison",
    text: "Une fois tes choix faits, tes images soigneusement retouchées te sont livrées dans un délai maximal de deux semaines. Tu les recevras en haute résolution, prêtes à être imprimées, ainsi qu’en format web, faciles à partager.",
    img: "deroulement-livraison",
  },
];

export default function DeroulementPage() {
  return (
    <>
      <SiteNav active="deroulement" />
      <section className="px-[6vw] py-16">
        <div className="mx-auto max-w-[720px] text-center">
          <h1 className="text-[clamp(28px,3.4vw,40px)]">Déroulement d&apos;une séance</h1>
          <p className="mt-2 font-signature text-2xl">Travailler avec moi</p>
          <p className="mt-3 text-fg-muted">
            De la première prise de contact jusqu&apos;à la livraison de tes photos.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-[1100px] space-y-16">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className={
                "flex flex-wrap items-center gap-12 " +
                (i % 2 === 1 ? "flex-row-reverse" : "")
              }
            >
              <div className="relative h-[300px] min-w-[280px] flex-1 overflow-hidden bg-bg-alt">
                <Image
                  src={`/images/${step.img}.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="min-w-[280px] flex-1">
                <h2 className="font-signature text-3xl">
                  {step.n}. {step.title}
                </h2>
                <p className="mt-3 text-fg-muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-16 max-w-[560px] border-t border-border pt-8 text-center text-sm text-fg-muted">
          Une garantie de confiance s’applique à toutes les expériences. Si après 30 minutes
          vous ne vous sentez pas en confiance, la séance est annulée ou reportée sans frais.
        </p>
      </section>

      <CtaBanner title="Prête à commencer?">
        <CalendlyButton />
        <Button href="/contact" variant="outline-on-dark">
          Envoyer un message
        </Button>
      </CtaBanner>
    </>
  );
}
