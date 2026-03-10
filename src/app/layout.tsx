import type { Metadata } from "next";
import { Noto_Sans, Patua_One, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const patuaOne = Patua_One({
  variable: "--font-patua-one",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artifacta — Objects, Voices and Global Journeys",
  description:
    "Exploring identity through objects in a world shaped by migration. Browse our collection of global artifacts and cultural stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${patuaOne.variable} ${playfairDisplay.variable} ${notoSans.variable} flex min-h-screen flex-col antialiased`}
      >
        {/* Decorative SVG mask overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/imgs-mask.svg"
            alt=""
            className="absolute top-[-1000.39px] right-[-559.15px] w-[2667.3px] h-[2695.11px] rotate-[-86.67deg] opacity-100"
          />
        </div>
        <Navbar />
        <main className="relative z-10 flex-1 px-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
