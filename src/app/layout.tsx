import type { Metadata } from "next";
import { Jost, Caveat } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Véronique Chantal Photo",
  description:
    "Portraits et séances boudoir en douceur — Véronique Chantal, photographe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${jost.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
