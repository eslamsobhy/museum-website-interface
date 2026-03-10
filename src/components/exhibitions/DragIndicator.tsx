"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function DragIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    const container = containerRef.current;
    const text = textRef.current;

    const onEnter = () => {
      gsap.to(container, {
        width: 44,
        height: 44,
        gap: 0,
        backgroundColor: "#d8d0c4",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(text, {
        opacity: 0,
        height: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(container, {
        width: 54,
        height: 54,
        gap: 6,
        backgroundColor: "#EFEBE5",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(text, {
        opacity: 1,
        height: 10,
        duration: 0.2,
        ease: "power2.out",
        delay: 0.1,
      });
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="fixed bottom-[200px] left-1/2 z-40 -translate-x-1/2 lg:bottom-[303px]">
      <div
        ref={containerRef}
        className="flex h-[54px] w-[54px] flex-col items-center justify-center gap-[6px] overflow-hidden rounded-full bg-cream"
      >
        <Image
          src="/drag-icon.svg"
          alt="Drag"
          width={16}
          height={16}
          draggable={false}
        />
        <span
          ref={textRef}
          className="h-[10px] font-noto text-[11px] leading-[10px] text-dark-blue"
        >
          Drag
        </span>
      </div>
    </div>
  );
}
