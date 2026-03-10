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
        <Navbar />
        <main className="relative z-10 flex-1 px-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
