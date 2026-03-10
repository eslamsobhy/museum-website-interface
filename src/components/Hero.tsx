"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";

const ArtifactDisc = dynamic(() => import("./ArtifactDisc"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.8,
      });

      tl.fromTo(
        ".hero-line",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 }
      )
        .fromTo(
          ".hero-subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ".hero-scroll-indicator",
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-dvh flex-col items-center justify-center overflow-hidden px-6 lg:h-auto lg:min-h-screen lg:justify-start"
    >
      <div className="relative mx-auto w-full max-w-[1380px] lg:top-[-125px]">
        {mounted && <ArtifactDisc />}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex max-w-[384px] flex-col items-center justify-center gap-[30px]">
            <div className="mb-[30px] flex flex-col gap-[30px]">
              <h1 className="hero-line text-center font-playfair text-[32px] leading-[38px] font-normal text-cream sm:text-[42px] sm:leading-[48px] lg:text-[57px] lg:leading-[62px]">
                Objects, Voices and Global Journeys
              </h1>
              <p className="hero-subtitle text-center font-playfair text-[17px] leading-[28px] font-normal text-cream">
                Exploring identity through objects in a world shaped by
                migration.
              </p>
            </div>
            <Link
              href="/exhibitions"
              className="hero-cta inline-flex h-[50px] items-center rounded-cta bg-cream px-10 py-4 font-patua text-[15px] text-dark-blue transition-all duration-300 hover:opacity-90"
            >
              Enter Exhibition
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
            Scroll
          </span>
          <div className="h-10 w-px animate-pulse bg-linear-to-b from-cream/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
