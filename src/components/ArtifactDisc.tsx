"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SIZE = 1380;
const CX = SIZE / 2;
const CY = SIZE / 2;
const THICKNESS = 80;
const CORNER_R = 20;
const NUM_ARCS = 3;
const RING_GAP = 24;
const ARC_GAP_PX = 64;

const INNER_R = 400;
const MIDDLE_R = INNER_R + THICKNESS + RING_GAP;
const OUTER_R = MIDDLE_R + THICKNESS + RING_GAP;

const innerGapAngle = (ARC_GAP_PX / INNER_R) * (180 / Math.PI);
const innerArcAngle = (360 - NUM_ARCS * innerGapAngle) / NUM_ARCS;
const arcLength = INNER_R * innerArcAngle * (Math.PI / 180);

function computeArcs(centerR: number) {
  const arcAngle = (arcLength / centerR) * (180 / Math.PI);
  const section = 360 / NUM_ARCS;

  return Array.from({ length: NUM_ARCS }, (_, i) => {
    const center = section * i + section / 2;
    return {
      startDeg: Math.round((center - arcAngle / 2) * 100) / 100,
      endDeg: Math.round((center + arcAngle / 2) * 100) / 100,
    };
  });
}

function roundedArcPath(
  centerR: number,
  startDeg: number,
  endDeg: number
): string {
  const outerR = centerR + THICKNESS / 2;
  const innerR = centerR - THICKNESS / 2;
  const cr = CORNER_R;
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const p = (n: number) => Math.round(n * 100) / 100;

  const dO = (cr / outerR) * (180 / Math.PI);
  const dI = (cr / innerR) * (180 / Math.PI);

  const a1r = toRad(startDeg + dO);
  const a2r = toRad(startDeg);
  const a1 = [p(CX + outerR * Math.cos(a1r)), p(CY + outerR * Math.sin(a1r))];
  const a2 = [p(CX + (outerR - cr) * Math.cos(a2r)), p(CY + (outerR - cr) * Math.sin(a2r))];

  const b1r = toRad(endDeg - dO);
  const b2r = toRad(endDeg);
  const b1 = [p(CX + outerR * Math.cos(b1r)), p(CY + outerR * Math.sin(b1r))];
  const b2 = [p(CX + (outerR - cr) * Math.cos(b2r)), p(CY + (outerR - cr) * Math.sin(b2r))];

  const c1r = toRad(endDeg);
  const c2r = toRad(endDeg - dI);
  const c1 = [p(CX + (innerR + cr) * Math.cos(c1r)), p(CY + (innerR + cr) * Math.sin(c1r))];
  const c2 = [p(CX + innerR * Math.cos(c2r)), p(CY + innerR * Math.sin(c2r))];

  const d1r = toRad(startDeg + dI);
  const d2r = toRad(startDeg);
  const d1 = [p(CX + innerR * Math.cos(d1r)), p(CY + innerR * Math.sin(d1r))];
  const d2 = [p(CX + (innerR + cr) * Math.cos(d2r)), p(CY + (innerR + cr) * Math.sin(d2r))];

  const lgO = endDeg - startDeg - 2 * dO > 180 ? 1 : 0;
  const lgI = endDeg - startDeg - 2 * dI > 180 ? 1 : 0;

  return [
    `M ${a1[0]} ${a1[1]}`,
    `A ${outerR} ${outerR} 0 ${lgO} 1 ${b1[0]} ${b1[1]}`,
    `A ${cr} ${cr} 0 0 1 ${b2[0]} ${b2[1]}`,
    `L ${c1[0]} ${c1[1]}`,
    `A ${cr} ${cr} 0 0 1 ${c2[0]} ${c2[1]}`,
    `A ${innerR} ${innerR} 0 ${lgI} 0 ${d1[0]} ${d1[1]}`,
    `A ${cr} ${cr} 0 0 1 ${d2[0]} ${d2[1]}`,
    `L ${a2[0]} ${a2[1]}`,
    `A ${cr} ${cr} 0 0 1 ${a1[0]} ${a1[1]}`,
    "Z",
  ].join(" ");
}

const innerArcs = computeArcs(INNER_R);
const middleArcs = computeArcs(MIDDLE_R);
const outerArcs = computeArcs(OUTER_R);

const images = {
  inner: [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&fit=crop",
    "https://images.unsplash.com/photo-1569587112025-0d460e81a126?w=600&fit=crop",
  ],
  middle: [
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&fit=crop",
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&fit=crop",
  ],
  outer: [
    "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&fit=crop",
    "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&fit=crop",
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&fit=crop",
  ],
};

function ArcSegment({
  centerR,
  startDeg,
  endDeg,
  image,
  clipId,
}: {
  centerR: number;
  startDeg: number;
  endDeg: number;
  image: string;
  clipId: string;
}) {
  const outerR = centerR + THICKNESS / 2;
  const d = roundedArcPath(centerR, startDeg, endDeg);
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
      </defs>
      <image
        clipPath={`url(#${clipId})`}
        href={image}
        x={CX - outerR}
        y={CY - outerR}
        width={outerR * 2}
        height={outerR * 2}
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  );
}

export default function ArtifactDisc() {
  const innerRef = useRef<SVGGElement>(null);
  const middleRef = useRef<SVGGElement>(null);
  const outerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const angles = { inner: 0, middle: 0, outer: 0 };

    const apply = () => {
      innerRef.current?.setAttribute(
        "transform",
        `rotate(${angles.inner} ${CX} ${CY})`
      );
      middleRef.current?.setAttribute(
        "transform",
        `rotate(${angles.middle} ${CX} ${CY})`
      );
      outerRef.current?.setAttribute(
        "transform",
        `rotate(${angles.outer} ${CX} ${CY})`
      );
    };

    const ctx = gsap.context(() => {
      gsap.to(angles, {
        inner: 360,
        duration: 80,
        repeat: -1,
        ease: "none",
        onUpdate: apply,
      });

      gsap.to(angles, {
        middle: -360,
        duration: 100,
        repeat: -1,
        ease: "none",
        onUpdate: apply,
      });

      gsap.to(angles, {
        outer: 360,
        duration: 120,
        repeat: -1,
        ease: "none",
        onUpdate: apply,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full"
      style={{ maxWidth: SIZE }}
    >
      <g ref={innerRef}>
        {innerArcs.map((arc, i) => (
          <ArcSegment
            key={`inner-${i}`}
            centerR={INNER_R}
            startDeg={arc.startDeg}
            endDeg={arc.endDeg}
            image={images.inner[i]}
            clipId={`inner-${i}`}
          />
        ))}
      </g>
      <g ref={middleRef}>
        {middleArcs.map((arc, i) => (
          <ArcSegment
            key={`middle-${i}`}
            centerR={MIDDLE_R}
            startDeg={arc.startDeg}
            endDeg={arc.endDeg}
            image={images.middle[i]}
            clipId={`middle-${i}`}
          />
        ))}
      </g>
      <g ref={outerRef}>
        {outerArcs.map((arc, i) => (
          <ArcSegment
            key={`outer-${i}`}
            centerR={OUTER_R}
            startDeg={arc.startDeg}
            endDeg={arc.endDeg}
            image={images.outer[i]}
            clipId={`outer-${i}`}
          />
        ))}
      </g>
    </svg>
  );
}
