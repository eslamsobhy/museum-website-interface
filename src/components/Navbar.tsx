"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: -15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 z-50 w-full"
    >
      <div className="flex items-center justify-between px-4 py-5 lg:px-10">
        <button
          className="nav-item opacity-0"
          aria-label="Toggle sound"
        >
          <Image
            src="/sound.svg"
            alt="Sound"
            width={50}
            height={50}
          />
        </button>

        <Link href="/" className="nav-item opacity-0">
          <Image
            src="/Logo-Text.svg"
            alt="Artifacta"
            width={173}
            height={46}
          />
        </Link>

        <div className="nav-item w-[50px] opacity-0" />
      </div>
    </nav>
  );
}
