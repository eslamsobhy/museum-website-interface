"use client";

import { useLayoutEffect, useState, useEffect, useMemo } from "react";
import gsap from "gsap";
import type { Exhibition } from "@/data/exhibitions";
import { useDraggable } from "@/hooks/useDraggable";
import ExhibitionCard from "./ExhibitionCard";
import DragIndicator from "./DragIndicator";

const LG_BREAKPOINT = 1024;

interface GridConfig {
  cols: number;
  cellW: number;
  gap: number;
}

const GRID_CONFIG: Record<"mobile" | "desktop", GridConfig> = {
  mobile: { cols: 5, cellW: 240, gap: 60 },
  desktop: { cols: 5, cellW: 400, gap: 120 },
};

interface GridViewProps {
  exhibitions: Exhibition[];
}

function useGridConfig() {
  const [config, setConfig] = useState(GRID_CONFIG.desktop);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);
    const update = (e: MediaQueryList | MediaQueryListEvent) =>
      setConfig(e.matches ? GRID_CONFIG.desktop : GRID_CONFIG.mobile);
    update(mql);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return config;
}

export default function GridView({ exhibitions }: GridViewProps) {
  const { cols, cellW, gap } = useGridConfig();
  const rowOffset = useMemo(() => (cellW + gap) / 2, [cellW, gap]);

  const { viewportRef, contentRef, handlers } = useDraggable({
    edgePadding: 100,
    extraWidth: rowOffset,
  });

  useLayoutEffect(() => {
    if (!contentRef.current || !viewportRef.current) return;
    const vp = viewportRef.current;
    const grid = contentRef.current;

    const ox = (vp.clientWidth - grid.offsetWidth) / 2;
    const oy = (vp.clientHeight - grid.offsetHeight) / 2;
    gsap.set(grid, { x: ox, y: oy });

    const cards = grid.querySelectorAll("[data-flip-id]");
    gsap.killTweensOf(cards);
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.03, ease: "power3.out" }
    );
  }, [exhibitions, contentRef, viewportRef, cellW, gap]);

  return (
    <>
      <DragIndicator />
      <div
        ref={viewportRef}
        className="fixed inset-0 z-20 cursor-grab select-none touch-none overflow-hidden active:cursor-grabbing"
        {...handlers}
      >
        <div
          ref={contentRef}
          className="absolute grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
            gap,
          }}
        >
          {exhibitions.map((ex, i) => {
            const row = Math.floor(i / cols);
            const isOddRow = row % 2 === 0;
            return (
              <div
                key={ex.id}
                style={
                  isOddRow
                    ? { transform: `translateX(${rowOffset}px)` }
                    : undefined
                }
              >
                <ExhibitionCard exhibition={ex} viewMode="grid" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
