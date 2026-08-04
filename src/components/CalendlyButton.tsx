import Button from "./Button";

/**
 * Renders the Calendly CTA only once a real link is configured
 * (CALENDLY_URL env var) — avoids shipping a dead "#" placeholder link.
 */
export default function CalendlyButton({
  variant = "solid",
  label = "Réserver via Calendly",
}: {
  variant?: "solid" | "outline" | "outline-on-dark";
  label?: string;
}) {
  const url = process.env.CALENDLY_URL;
  if (!url) return null;
  return (
    <Button href={url} variant={variant} external>
      {label}
    </Button>
  );
}
