"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import type { Exhibition } from "@/data/exhibitions";
import ExhibitionCard from "./ExhibitionCard";

interface ListViewProps {
  exhibitions: Exhibition[];
}

export default function ListView({ exhibitions }: ListViewProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll("[data-flip-id]");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }
    );
  }, [exhibitions]);

  return (
    <div
      ref={listRef}
      className="flex flex-col gap-[15px] pt-[265px] pb-[200px]"
    >
      {exhibitions.map((ex) => (
        <ExhibitionCard key={ex.id} exhibition={ex} viewMode="list" />
      ))}
    </div>
  );
}
