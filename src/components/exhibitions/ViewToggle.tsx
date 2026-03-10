"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

import type { ViewMode } from "@/data/exhibitions";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const INDICATOR_SIZE = 38;

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (!indicatorRef.current || !targetRef.current) return;

    const left = targetRef.current.offsetLeft;
    const top = targetRef.current.offsetTop;

    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(indicatorRef.current, { left, top });
    } else {
      gsap.to(indicatorRef.current, {
        left,
        top,
        duration: 0.4,
        ease: "power3.inOut",
      });
    }
  }, [viewMode]);

  return (
    <div className="fixed bottom-[124px] left-1/2 z-40 -translate-x-1/2">
      <div className="relative flex h-[50px] items-center gap-[5px] rounded-[80px] bg-separator p-[6px]">
        {/* Sliding cream indicator */}
        <div
          ref={indicatorRef}
          className="absolute rounded-full bg-cream"
          style={{ width: INDICATOR_SIZE, height: INDICATOR_SIZE }}
        />

        {viewMode === "list" ? (
          <>
            <button
              onClick={() => onChange("grid")}
              className="relative z-10 flex cursor-pointer items-center gap-[5px] p-[10px]"
            >
              <Image
                src="/grid-icon.svg"
                alt=""
                width={20}
                height={20}
                draggable={false}
              />
              <span className="whitespace-nowrap font-playfair text-[14px] font-medium text-dark-blue">
                Switch to grid
              </span>
            </button>
            <div
              ref={targetRef}
              className="relative z-10 flex items-center justify-center"
              style={{ width: INDICATOR_SIZE, height: INDICATOR_SIZE }}
            >
              <Image
                src="/listing-icon.svg"
                alt=""
                width={20}
                height={20}
                draggable={false}
              />
            </div>
          </>
        ) : (
          <>
            <div
              ref={targetRef}
              className="relative z-10 flex items-center justify-center"
              style={{ width: INDICATOR_SIZE, height: INDICATOR_SIZE }}
            >
              <Image
                src="/grid-icon.svg"
                alt=""
                width={20}
                height={20}
                draggable={false}
              />
            </div>
            <button
              onClick={() => onChange("list")}
              className="relative z-10 flex cursor-pointer items-center gap-[5px] p-[10px]"
            >
              <Image
                src="/listing-icon.svg"
                alt=""
                width={20}
                height={20}
                draggable={false}
              />
              <span className="whitespace-nowrap font-playfair text-[14px] font-medium text-dark-blue">
                Switch to list
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
