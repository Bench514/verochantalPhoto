import type { ReactNode } from "react";

export default function CtaBanner({
  title,
  text,
  children,
  tall = false,
}: {
  title: string;
  /** En mobile, occupe presque tout l'écran en hauteur, contenu centré. */
  tall?: boolean;
  text?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "bg-dark px-[6vw] py-20 text-center" +
        (tall
          ? " flex min-h-[85svh] flex-col items-center justify-center md:block md:min-h-0"
          : "")
      }
    >
      <h2 className="font-signature text-3xl text-on-dark">{title}</h2>
      {text && <p className="mx-auto mt-3 max-w-md text-sm text-on-dark-muted">{text}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
    </div>
  );
}
