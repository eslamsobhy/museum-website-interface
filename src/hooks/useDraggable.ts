"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

interface DraggableOptions {
  edgePadding?: number;
  rubberBand?: number;
  /** Extra width to account for (e.g. staggered row offset) */
  extraWidth?: number;
}

const DEFAULTS: Required<DraggableOptions> = {
  edgePadding: 100,
  rubberBand: 4,
  extraWidth: 0,
};

function elastic(v: number, min: number, max: number, rubber: number) {
  if (v > max) return max + (v - max) / rubber;
  if (v < min) return min - (min - v) / rubber;
  return v;
}

function clampValue(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Custom hook for pointer-based drag with elastic boundaries and momentum.
 * Returns refs to attach to the viewport and content elements,
 * plus pointer event handlers for the viewport.
 */
export function useDraggable(options: DraggableOptions = {}) {
  const { edgePadding, rubberBand, extraWidth } = { ...DEFAULTS, ...options };

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    prevX: 0,
    prevY: 0,
    prevT: 0,
    vx: 0,
    vy: 0,
  });

  const getBounds = useCallback(() => {
    if (!viewportRef.current || !contentRef.current) {
      return { minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity };
    }
    const vpW = viewportRef.current.clientWidth;
    const vpH = viewportRef.current.clientHeight;
    const cW = contentRef.current.offsetWidth + extraWidth;
    const cH = contentRef.current.offsetHeight;
    return {
      minX: vpW - cW - edgePadding,
      maxX: edgePadding,
      minY: vpH - cH - edgePadding,
      maxY: edgePadding,
    };
  }, [edgePadding, extraWidth]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!contentRef.current) return;
      gsap.killTweensOf(contentRef.current);
      const d = drag.current;
      d.active = true;
      d.startX = e.clientX;
      d.startY = e.clientY;
      d.originX = gsap.getProperty(contentRef.current, "x") as number;
      d.originY = gsap.getProperty(contentRef.current, "y") as number;
      d.prevX = e.clientX;
      d.prevY = e.clientY;
      d.prevT = Date.now();
      d.vx = 0;
      d.vy = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d.active || !contentRef.current) return;
      const now = Date.now();
      const dt = Math.max(now - d.prevT, 1);
      d.vx = ((e.clientX - d.prevX) / dt) * 16;
      d.vy = ((e.clientY - d.prevY) / dt) * 16;
      d.prevX = e.clientX;
      d.prevY = e.clientY;
      d.prevT = now;
      const b = getBounds();
      gsap.set(contentRef.current, {
        x: elastic(d.originX + (e.clientX - d.startX), b.minX, b.maxX, rubberBand),
        y: elastic(d.originY + (e.clientY - d.startY), b.minY, b.maxY, rubberBand),
      });
    },
    [getBounds, rubberBand]
  );

  const onPointerUp = useCallback(() => {
    const d = drag.current;
    if (!d.active || !contentRef.current) return;
    d.active = false;
    const cx = gsap.getProperty(contentRef.current, "x") as number;
    const cy = gsap.getProperty(contentRef.current, "y") as number;
    const b = getBounds();
    const isOverBounds =
      cx !== clampValue(cx, b.minX, b.maxX) ||
      cy !== clampValue(cy, b.minY, b.maxY);
    gsap.to(contentRef.current, {
      x: clampValue(cx + d.vx * 25, b.minX, b.maxX),
      y: clampValue(cy + d.vy * 25, b.minY, b.maxY),
      duration: isOverBounds ? 0.5 : 1.2,
      ease: "power3.out",
    });
  }, [getBounds]);

  return {
    viewportRef,
    contentRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
