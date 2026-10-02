import SiteNav from "@/components/SiteNav";
import ContactForm from "@/components/ContactForm";
import CalendlyButton from "@/components/CalendlyButton";
import { CONTACT_EMAIL, SERVICE_AREAS, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Écris à Véronique Chantal pour réserver ta séance photo boudoir ou portrait à Montréal, dans les Laurentides ou Lanaudière. Réponse sous 1 à 2 jours ouvrables.",
  path: "/contact",
});

export default function ContactPage() {
  const email = CONTACT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;

  return (
    <>
      <SiteNav active="contact" />
      <section className="mx-auto flex max-w-[1300px] flex-wrap gap-16 px-[6vw] py-16">
        <div className="w-full md:w-auto md:min-w-[280px] md:flex-1">
          <h1 className="text-[clamp(28px,3.4vw,40px)]">Contact</h1>
          <p className="mt-3 text-fg-muted">
            Réponse généralement sous 1 à 2 jours ouvrables.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.1em] text-fg-muted">Courriel</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 block break-words text-[15px] hover:opacity-70"
              >
                {email}
              </a>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-[0.1em] text-fg-muted">Région desservie</p>
              <p className="mt-1 text-[15px]">{SERVICE_AREAS.join(", ")}</p>
            </div>
            {phone && (
              <div>
                <p className="text-[12px] uppercase tracking-[0.1em] text-fg-muted">Téléphone</p>
                <p className="mt-1 text-[15px]">{phone}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <CalendlyButton variant="solid" label="Réserver directement via Calendly →" />
          </div>
        </div>

        <div className="w-full md:w-auto md:min-w-[360px] md:flex-[1.4]">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
