import SiteNav from "@/components/SiteNav";
import ContactForm from "@/components/ContactForm";
import CalendlyButton from "@/components/CalendlyButton";

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bonjour@veroniquechantalphoto.ca";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;

  return (
    <>
      <SiteNav active="contact" />
      <section className="mx-auto flex max-w-[1100px] flex-wrap gap-16 px-[6vw] py-16">
        <div className="min-w-[280px] flex-1">
          <h1 className="text-[clamp(28px,3.4vw,40px)]">Contact</h1>
          <p className="mt-3 text-fg-muted">
            Réponse généralement sous 1 à 2 jours ouvrables.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-[12px] uppercase tracking-[0.1em] text-fg-muted">Courriel</p>
              <p className="mt-1 text-[15px]">{email}</p>
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

        <div className="min-w-[280px] flex-1">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
