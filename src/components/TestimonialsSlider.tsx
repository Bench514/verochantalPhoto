"use client";

import { useRef, useState } from "react";

type Testimonial = { quote: string; author: string };

/**
 * Témoignages de l'accueil. En mobile (sous md) : slider horizontal qu'on
 * fait glisser au doigt (scroll-snap natif), avec des points pour situer et
 * changer de témoignage. À partir de md : les trois côte à côte, comme avant.
 */
export default function TestimonialsSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="mx-auto mt-10 max-w-[1000px]">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:snap-none md:grid-cols-3 md:gap-10 md:overflow-visible"
      >
        {testimonials.map((t, i) => (
          <figure
            key={t.author}
            aria-roledescription="témoignage"
            aria-label={`${i + 1} sur ${testimonials.length}`}
            className="flex w-full shrink-0 snap-center flex-col items-center justify-center px-2 text-center md:h-full md:justify-start md:px-0"
          >
            <blockquote className="font-name text-[22px] font-light italic leading-relaxed text-fg md:text-[17px]">
              « {t.quote} »
            </blockquote>
            <figcaption className="pt-5 text-[13px] uppercase tracking-[0.1em] text-fg-muted md:mt-auto md:pt-4">
              {t.author}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-1 md:hidden">
        {testimonials.map((t, i) => (
          <button
            key={t.author}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Afficher le témoignage ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
            className="flex h-8 w-8 items-center justify-center"
          >
            <span
              className={
                "block h-2 w-2 rounded-full transition-colors duration-300 " +
                (i === current ? "bg-fg" : "bg-fg/25")
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
