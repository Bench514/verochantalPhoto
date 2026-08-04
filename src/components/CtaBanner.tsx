import type { ReactNode } from "react";

export default function CtaBanner({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-dark px-[6vw] py-20 text-center">
      <h2 className="font-signature text-3xl text-on-dark">{title}</h2>
      {text && <p className="mx-auto mt-3 max-w-md text-sm text-on-dark-muted">{text}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>
    </div>
  );
}
