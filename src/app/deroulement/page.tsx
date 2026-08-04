import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import Button from "@/components/Button";
import CtaBanner from "@/components/CtaBanner";
import CalendlyButton from "@/components/CalendlyButton";

const STEPS = [
  {
    n: "1",
    title: "Consultation",
    text: "On discute par message ou en appel de ta vision, de tes envies et de ce qui te mettrait le plus à l'aise.",
    img: "deroulement-consultation",
  },
  {
    n: "2",
    title: "Préparation",
    text: "Choix du lieu, des tenues et de l'ambiance souhaitée, pour que tout soit clair avant le jour J.",
    img: "deroulement-preparation",
  },
  {
    n: "3",
    title: "La séance",
    text: "On avance à ton rythme, avec de la musique et beaucoup de bienveillance — aucune pose n'est forcée.",
    img: "deroulement-seance",
  },
  {
    n: "4",
    title: "Sélection",
    text: "Tu reçois une galerie privée en ligne pour choisir tes photos préférées, sans pression de temps.",
    img: "deroulement-selection",
  },
  {
    n: "5",
    title: "Livraison",
    text: "Tes photos retouchées te sont livrées en haute résolution, prêtes à être partagées ou imprimées.",
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
