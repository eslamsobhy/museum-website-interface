# Artifacta — Detailed Application Breakdown

This document explains every part of the application in depth: the architecture, data layer, every component, every animation, and — most importantly — how the `ArtifactDisc` concentric-ring SVG was built from scratch.

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Data Layer](#2-data-layer)
3. [Root Layout](#3-root-layout)
4. [Navbar](#4-navbar)
5. [Hero Page](#5-hero-page)
6. [ArtifactDisc — The Concentric Rings (Deep Dive)](#6-artifactdisc--the-concentric-rings-deep-dive)
7. [Exhibitions Page](#7-exhibitions-page)
8. [ExhibitionsList — The Orchestrator](#8-exhibitionslist--the-orchestrator)
9. [CategoryFilter](#9-categoryfilter)
10. [ViewToggle](#10-viewtoggle)
11. [ListView](#11-listview)
12. [GridView](#12-gridview)
13. [ExhibitionCard](#13-exhibitioncard)
14. [DragIndicator](#14-dragindicator)
15. [useDraggable Hook](#15-usedraggable-hook)
16. [FallbackImage](#16-fallbackimage)
17. [Icon Components](#17-icon-components)
18. [Footer](#18-footer)
19. [Styling & Theme](#19-styling--theme)
20. [Animations Summary](#20-animations-summary)

---

## 1. Project Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── globals.css             # Tailwind config + custom theme tokens
│   ├── layout.tsx              # Root layout (Navbar, Footer, SVG mask)
│   ├── page.tsx                # Home route → renders <Hero />
│   ├── icon.svg                # Favicon
│   └── exhibitions/
│       └── page.tsx            # /exhibitions route → renders <ExhibitionsList />
├── components/
│   ├── Navbar.tsx              # Fixed top navbar
│   ├── Hero.tsx                # Full-screen hero with CTA
│   ├── ArtifactDisc.tsx        # Animated SVG concentric rings
│   ├── Footer.tsx              # Fixed bottom footer
│   ├── FallbackImage.tsx       # Image wrapper with error fallback
│   ├── icons/
│   │   ├── ArrowIcon.tsx       # Circle arrow icon
│   │   ├── ChevronIcon.tsx     # Dropdown chevron icon
│   │   └── SocialIcons.tsx     # X, YouTube, Contrast toggle icons
│   └── exhibitions/
│       ├── ExhibitionsList.tsx  # State orchestrator (filter + view mode)
│       ├── ListView.tsx         # Vertical card list with staggered entrance
│       ├── GridView.tsx         # Draggable grid canvas with momentum
│       ├── ExhibitionCard.tsx   # Card component (adapts to list/grid)
│       ├── CategoryFilter.tsx   # Category pill bar (desktop) / dropdown (mobile)
│       ├── ViewToggle.tsx       # List/Grid toggle with sliding indicator
│       └── DragIndicator.tsx    # Floating "Drag" hint button
├── hooks/
│   └── useDraggable.ts         # Custom hook: pointer drag with elastic bounds + momentum
└── data/
    └── exhibitions.ts          # Types, categories array, and mock exhibition data
```

The app uses the **Next.js App Router** pattern. There are only two routes:

- `/` — The home page (Hero)
- `/exhibitions` — The exhibition browser

There is no API or database. All data is static and lives in `src/data/exhibitions.ts`.

---

## 2. Data Layer

**File:** `src/data/exhibitions.ts`

This file defines everything the app needs for data:

### Categories

```typescript
export const categories = [
  "All Objects",
  "Architectural",
  "Ceremonial",
  "Decorative",
  "Musical",
  "Playful",
  "Useable",
  "Wearable",
] as const;
```

The `as const` assertion makes this a **readonly tuple**, which means TypeScript knows the exact literal string values — not just `string[]`.

### Types

```typescript
export type Category = (typeof categories)[number];
// Resolves to: "All Objects" | "Architectural" | "Ceremonial" | ...

export type ViewMode = "list" | "grid";

export interface Exhibition {
  id: string;
  title: string;
  category: Exclude<Category, "All Objects">;
  image: string;
}
```

The `Exclude<Category, "All Objects">` is key — it means an actual exhibition can never have the category `"All Objects"`. That value only exists as a filter option meaning "show everything". This prevents accidentally creating an exhibition with `category: "All Objects"` since TypeScript would reject it at compile time.

### Mock Data

The file exports an array of 16 `Exhibition` objects. Each has an `id`, `title`, a `category` from the valid set, and an `image` URL pointing to Unsplash.

There is **no data fetching** in this app. The exhibitions page imports the array directly. The `/exhibitions/page.tsx` is a **server component** (no `"use client"` directive) that imports `ExhibitionsList` and renders it. The data is bundled at build time.

---

## 3. Root Layout

**File:** `src/app/layout.tsx`

The root layout does four things:

### 1. Font Loading

Three Google Fonts are loaded via `next/font/google`:

- **Patua One** (`--font-patua-one`) — Used for the CTA buttons and brand text
- **Playfair Display** (`--font-playfair-display`) — Used for headings and body text throughout
- **Noto Sans** (`--font-noto-sans`) — Used for small UI labels like the "Drag" text

Each font is assigned a CSS variable, and those variables are referenced in the Tailwind theme (`globals.css`) as `--font-patua`, `--font-playfair`, and `--font-noto`.

### 2. Metadata

```typescript
export const metadata: Metadata = {
  title: "Artifacta — Objects, Voices and Global Journeys",
  description: "Exploring identity through objects...",
};
```

### 3. Decorative SVG Mask Overlay

A large SVG image (`/imgs-mask.svg`) is positioned as a fixed background overlay. It is rotated ~87 degrees and offset far to the top-right, creating a subtle decorative texture behind everything. It has `pointer-events-none` and `aria-hidden="true"` so it is purely decorative.

### 4. Page Structure

The body has a `flex min-h-screen flex-col` layout:
- `<Navbar />` — fixed at top, z-50
- `<main>` — flex-1, relative z-10, with horizontal padding
- `<Footer />` — fixed at bottom, z-50

---

## 4. Navbar

**File:** `src/components/Navbar.tsx`

A simple fixed top navbar with three elements in a row:

1. **Sound button** (left) — A decorative sound icon button (no functionality implemented yet)
2. **Logo** (center) — The Artifacta logo SVG, links to `/`
3. **Spacer** (right) — An empty 50px div to balance the layout

### Animation

On mount, GSAP runs a staggered animation on all elements with class `.nav-item`:

```
fromTo: { opacity: 0, y: -15 } → { opacity: 1, y: 0 }
duration: 0.8s, stagger: 0.12s, delay: 0.3s
```

Each nav item starts invisible and 15px above its final position, then slides down and fades in. The stagger means each element starts 120ms after the previous one, creating a cascading reveal from left to right.

The items start with `opacity-0` in their CSS class (initial state), and GSAP overrides this.

---

## 5. Hero Page

**File:** `src/components/Hero.tsx`

The home page renders only the `<Hero />` component. It is a full-viewport section with:

1. **ArtifactDisc** — The animated concentric rings (covered in detail next)
2. **Text overlay** — Centered on top of the disc: heading, subtitle, and CTA button
3. **Scroll indicator** — A "Scroll" label with a pulsing vertical line at the bottom

### Dynamic Import

```typescript
const ArtifactDisc = dynamic(() => import("./ArtifactDisc"), { ssr: false });
```

`ArtifactDisc` is loaded with `ssr: false`. This is **critical** because the SVG path calculations use `Math.cos`/`Math.sin` which produce floating-point numbers. If the server renders these paths and the client recalculates them, tiny floating-point differences would cause a React hydration mismatch. By disabling SSR, the component only ever renders on the client, avoiding this entirely.

The `mounted` state ensures the disc only appears after the first client render:

```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
// ...
{mounted && <ArtifactDisc />}
```

### Animation Timeline

A GSAP timeline runs on mount with a 0.8s initial delay:

1. `.hero-line` (heading) — slides up 60px and fades in over 1.2s
2. `.hero-subtitle` — slides up 20px and fades in over 1s, starting 0.5s before the heading finishes
3. `.hero-cta` (button) — slides up 20px and fades in over 0.8s
4. `.hero-scroll-indicator` — fades in over 1s

The negative offsets (`"-=0.5"`, `"-=0.4"`, `"-=0.2"`) overlap animations so they feel connected rather than sequential.

---

## 6. ArtifactDisc — The Concentric Rings (Deep Dive)

**File:** `src/components/ArtifactDisc.tsx`

This is the most complex component in the app. It renders three concentric rings of arc-shaped segments, each filled with an image, and each ring rotates continuously at a different speed. Here is how every piece works.

### 6.1 Constants

```typescript
const SIZE = 1380;          // SVG viewBox is 1380×1380
const CX = SIZE / 2;        // Center X = 690
const CY = SIZE / 2;        // Center Y = 690
const THICKNESS = 80;        // Each ring/arc is 80px thick (radial thickness)
const CORNER_R = 20;         // Rounded corner radius at each arc tip
const NUM_ARCS = 3;          // 3 arcs per ring
const RING_GAP = 24;         // Radial gap between rings
const ARC_GAP_PX = 64;       // Gap between arcs (in pixels along the circumference)
```

There are three rings:

```typescript
const INNER_R = 400;                                // Inner ring center radius
const MIDDLE_R = INNER_R + THICKNESS + RING_GAP;    // = 400 + 80 + 24 = 504
const OUTER_R = MIDDLE_R + THICKNESS + RING_GAP;    // = 504 + 80 + 24 = 608
```

Each radius value is the **center** of the ring band. The actual ring spans from `centerR - THICKNESS/2` to `centerR + THICKNESS/2` (e.g., the inner ring goes from radius 360 to 440).

### 6.2 Computing Arc Angles — The Key Insight

The three rings have different radii, but we want the arcs to have the **same visual arc length** (in pixels along the curve). If we used the same angle for all three rings, the outer arcs would be much longer than the inner ones because `arc length = radius × angle`.

Here is how it works:

**Step 1: Compute the gap angle for the inner ring**

```typescript
const innerGapAngle = (ARC_GAP_PX / INNER_R) * (180 / Math.PI);
```

This converts the 64px gap into degrees at the inner ring's radius. The formula is: `angle = (arc_length / radius)` in radians, then convert to degrees.

**Step 2: Compute the inner ring's arc angle**

```typescript
const innerArcAngle = (360 - NUM_ARCS * innerGapAngle) / NUM_ARCS;
```

We subtract the total gap (3 gaps) from 360° and divide by 3 to get the angle each arc spans on the inner ring.

**Step 3: Compute the fixed arc length**

```typescript
const arcLength = INNER_R * innerArcAngle * (Math.PI / 180);
```

This converts the inner arc angle back to a pixel arc length. This `arcLength` value is now the **reference** used for all rings.

**Step 4: The `computeArcs` function**

```typescript
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
```

For any ring radius:
1. Compute how many degrees the fixed `arcLength` spans at this radius: `arcAngle = (arcLength / centerR) * (180 / Math.PI)`. A larger radius means a smaller angle for the same pixel length.
2. Divide the circle into 3 equal 120° sections.
3. Center each arc within its section. The arc spans from `sectionCenter - arcAngle/2` to `sectionCenter + arcAngle/2`.
4. Round to 2 decimal places to keep the SVG clean.

Result: the inner ring arcs span a larger angle, the outer ring arcs span a smaller angle, but they all have the same visual length along the curve.

### 6.3 Building the Rounded Arc Path — `roundedArcPath()`

This is the most mathematically involved function. Each arc is a thick band (like a curved rectangle) with **rounded corners at all four tips**. The path has 9 segments:

```
Outer arc (clockwise) → corner → radial line → corner → inner arc (counter-clockwise) → corner → radial line → corner → close
```

Here is the step-by-step breakdown:

#### Setup

```typescript
const outerR = centerR + THICKNESS / 2;  // Outer edge radius
const innerR = centerR - THICKNESS / 2;  // Inner edge radius
const cr = CORNER_R;                      // Corner radius (20px)
const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
```

The `toRad` function converts degrees to radians **with a -90° offset**. This is because in standard math, 0° points right (3 o'clock), but in this design, 0° should point up (12 o'clock). Subtracting 90° rotates the coordinate system so 0° is at the top.

The `p` function rounds numbers to 2 decimal places to avoid SVG path bloat.

#### The Corner Offset Angles

```typescript
const dO = (cr / outerR) * (180 / Math.PI);  // Corner angular offset on outer radius
const dI = (cr / innerR) * (180 / Math.PI);  // Corner angular offset on inner radius
```

The rounded corners eat into the arc. `dO` is how many degrees the corner takes up on the outer edge; `dI` is the same for the inner edge. Since `innerR` is smaller, `dI > dO` — the corners eat more angular space on tighter curves.

#### The 8 Key Points

The path needs 8 coordinate points (4 corners × 2 points each — the start and end of each corner arc):

**Point a — Start of outer arc (top-left of the band):**
- `a1` = point on outer edge, inset by `dO` from the start angle (where the outer arc begins after the corner)
- `a2` = point inset radially by `cr` from outer edge at the start angle (where the radial line meets the corner)

**Point b — End of outer arc (top-right of the band):**
- `b1` = point on outer edge, inset by `dO` from the end angle
- `b2` = point inset radially by `cr` from outer edge at the end angle

**Point c — Start of inner arc (bottom-right of the band):**
- `c1` = point outset radially by `cr` from inner edge at the end angle
- `c2` = point on inner edge, inset by `dI` from the end angle

**Point d — End of inner arc (bottom-left of the band):**
- `d1` = point on inner edge, inset by `dI` from the start angle
- `d2` = point outset radially by `cr` from inner edge at the start angle

#### The SVG Path Commands

```
M a1             — Move to the start of the outer arc
A outerR → b1    — Large outer arc (clockwise) from a1 to b1
A cr → b2        — Small corner arc (top-right corner)
L c1             — Straight radial line down to near the inner edge
A cr → c2        — Small corner arc (bottom-right corner)
A innerR → d1    — Large inner arc (counter-clockwise) from c2 to d1
A cr → d2        — Small corner arc (bottom-left corner)
L a2             — Straight radial line up to near the outer edge
A cr → a1        — Small corner arc (top-left corner, closing the shape)
Z                — Close path
```

The large-arc flag (`lgO`, `lgI`) is calculated to handle arcs that span more than 180°. For the outer arc: if the arc span minus the two corner offsets exceeds 180°, the flag is `1`; otherwise `0`. Same logic for the inner arc.

### 6.4 Pre-computed Arc Data

```typescript
const innerArcs = computeArcs(INNER_R);    // 3 arcs for the inner ring
const middleArcs = computeArcs(MIDDLE_R);  // 3 arcs for the middle ring
const outerArcs = computeArcs(OUTER_R);    // 3 arcs for the outer ring
```

These are computed once at module level (outside any component), so they never re-compute on re-renders.

### 6.5 Image Mapping

```typescript
const images = {
  inner: ["unsplash-url-1", "unsplash-url-2", "unsplash-url-3"],
  middle: ["unsplash-url-4", "unsplash-url-5", "unsplash-url-6"],
  outer: ["unsplash-url-7", "unsplash-url-8", "unsplash-url-9"],
};
```

9 images total, 3 per ring. Each arc segment gets one image.

### 6.6 The `ArcSegment` Component

```tsx
function ArcSegment({ centerR, startDeg, endDeg, image, clipId }) {
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
```

How it works:
1. Generate the rounded arc path using `roundedArcPath`.
2. Define a `<clipPath>` using that path shape.
3. Place a square `<image>` element that covers the full bounding box of the ring (from `CX - outerR` to `CX + outerR` in both axes).
4. Apply the clip path so only the arc-shaped region of the image is visible.
5. `preserveAspectRatio="xMidYMid slice"` ensures the image fills the clipped area without distortion (like CSS `object-fit: cover`).

### 6.7 The Main Component & Rotation Animation

```tsx
export default function ArtifactDisc() {
  const innerRef = useRef<SVGGElement>(null);
  const middleRef = useRef<SVGGElement>(null);
  const outerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const angles = { inner: 0, middle: 0, outer: 0 };

    const apply = () => {
      innerRef.current?.setAttribute("transform", `rotate(${angles.inner} ${CX} ${CY})`);
      middleRef.current?.setAttribute("transform", `rotate(${angles.middle} ${CX} ${CY})`);
      outerRef.current?.setAttribute("transform", `rotate(${angles.outer} ${CX} ${CY})`);
    };

    const ctx = gsap.context(() => {
      gsap.to(angles, { inner: 360, duration: 80, repeat: -1, ease: "none", onUpdate: apply });
      gsap.to(angles, { middle: -360, duration: 100, repeat: -1, ease: "none", onUpdate: apply });
      gsap.to(angles, { outer: 360, duration: 120, repeat: -1, ease: "none", onUpdate: apply });
    });

    return () => ctx.revert();
  }, []);

  return (
    <svg viewBox="0 0 1380 1380" ...>
      <g ref={innerRef}>{/* 3 inner ArcSegments */}</g>
      <g ref={middleRef}>{/* 3 middle ArcSegments */}</g>
      <g ref={outerRef}>{/* 3 outer ArcSegments */}</g>
    </svg>
  );
}
```

Each ring is wrapped in a `<g>` group with a ref. GSAP animates a plain JavaScript object `angles` and on every frame calls `apply()`, which sets the SVG `transform` attribute directly.

**Why `setAttribute` instead of GSAP CSS transforms?**

GSAP's CSS transform system works on DOM elements with `style.transform`. But SVG `<g>` elements use the `transform` attribute with a different syntax: `rotate(angle cx cy)`. The `cx cy` part specifies the rotation center. Using `setAttribute` directly avoids:
1. GSAP trying to parse/set CSS transforms on SVG elements (which behaves inconsistently across browsers)
2. Floating-point hydration mismatches (since we already skip SSR)

The three rings rotate at different speeds and in different directions:
- **Inner ring**: 360° in 80 seconds (clockwise)
- **Middle ring**: -360° in 100 seconds (counter-clockwise)
- **Outer ring**: 360° in 120 seconds (clockwise)

`repeat: -1` means infinite repetition. `ease: "none"` means constant speed (linear).

---

## 7. Exhibitions Page

**File:** `src/app/exhibitions/page.tsx`

```typescript
export default function ExhibitionsPage() {
  return <ExhibitionsList />;
}
```

This is a **server component** — it has no `"use client"` directive. It exports static `metadata` for SEO and renders the client-side `<ExhibitionsList />`. Since `ExhibitionsList` is marked `"use client"`, it becomes the client boundary. The page itself can still be server-rendered and the metadata can be extracted at build time.

---

## 8. ExhibitionsList — The Orchestrator

**File:** `src/components/exhibitions/ExhibitionsList.tsx`

This is the **thin state orchestrator** that manages two pieces of state and passes them down:

### State

```typescript
const [viewMode, setViewMode] = useState<ViewMode>("list");
const [activeCategory, setActiveCategory] = useState<Category>("All Objects");
```

### Filtering

```typescript
const filtered = useMemo(
  () =>
    activeCategory === "All Objects"
      ? exhibitions
      : exhibitions.filter((e) => e.category === activeCategory),
  [activeCategory]
);
```

`useMemo` ensures the filtered array is only recomputed when `activeCategory` changes, not on every render. If the category is `"All Objects"`, it returns the full array (no copy needed).

### Callbacks

```typescript
const handleViewChange = useCallback((mode: ViewMode) => {
  if (mode !== viewMode) setViewMode(mode);
}, [viewMode]);

const handleCategoryChange = useCallback((category: Category) => {
  setActiveCategory(category);
}, []);
```

`useCallback` stabilizes the function references so child components receiving them as props don't re-render unnecessarily.

### Render

```tsx
<>
  <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
  <ViewToggle viewMode={viewMode} onChange={handleViewChange} />
  {viewMode === "list" ? (
    <ListView exhibitions={filtered} />
  ) : (
    <GridView exhibitions={filtered} />
  )}
</>
```

The orchestrator renders the filter, the toggle, and conditionally either the list or grid view. It owns no layout or animation logic — those are delegated to the child components.

---

## 9. CategoryFilter

**File:** `src/components/exhibitions/CategoryFilter.tsx`

This component renders two different UIs based on screen size:

### Desktop (≥ 1024px): Horizontal Pill Row

A `role="tablist"` container with a button for each category. The active category gets a cream background with rounded corners. Inactive ones are transparent with a hover opacity effect.

### Mobile (< 1024px): Dropdown

A button showing the active category inside a pill. Clicking it opens a dropdown list below with GSAP animation:

```typescript
gsap.fromTo(
  listRef.current,
  { opacity: 0, y: -8, scaleY: 0.95 },
  { opacity: 1, y: 0, scaleY: 1, duration: 0.25, ease: "power3.out" }
);
```

The dropdown slides down 8px, scales vertically from 95% to 100%, and fades in — all in 0.25 seconds. The `origin-top` CSS class ensures the scale transform anchors at the top.

A click-outside listener closes the dropdown when tapping elsewhere.

### Accessibility

- `role="tablist"` and `role="tab"` on desktop
- `aria-haspopup="listbox"` and `aria-expanded` on the mobile trigger
- `role="listbox"` and `role="option"` with `aria-selected` on mobile dropdown items

---

## 10. ViewToggle

**File:** `src/components/exhibitions/ViewToggle.tsx`

A fixed-position toggle at the bottom of the screen that switches between list and grid views.

### Sliding Indicator

The toggle has a cream-colored circle (38×38px) that slides to highlight the active mode. The position is calculated from the `offsetLeft` and `offsetTop` of a `targetRef` div that is placed on the active icon:

```typescript
useLayoutEffect(() => {
  const left = targetRef.current.offsetLeft;
  const top = targetRef.current.offsetTop;

  if (firstRender.current) {
    gsap.set(indicatorRef.current, { left, top });  // Instant position on first render
  } else {
    gsap.to(indicatorRef.current, { left, top, duration: 0.4, ease: "power3.inOut" });
  }
}, [viewMode]);
```

On the first render, the indicator is placed instantly (`gsap.set`). On subsequent view mode changes, it slides with a 0.4s ease.

### Conditional Rendering

The component renders different button layouts depending on the current mode:
- **In list mode**: Shows "Switch to grid" button on the left, list icon on the right (highlighted)
- **In grid mode**: Shows grid icon on the left (highlighted), "Switch to list" button on the right

---

## 11. ListView

**File:** `src/components/exhibitions/ListView.tsx`

A vertical list of `ExhibitionCard` components with a staggered entrance animation.

### Animation

```typescript
useLayoutEffect(() => {
  const cards = listRef.current.querySelectorAll("[data-flip-id]");
  gsap.fromTo(
    cards,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }
  );
}, [exhibitions]);
```

Every time the `exhibitions` array changes (e.g., when the user changes the category filter), all cards slide up 40px and fade in with a 60ms stagger between each card. `useLayoutEffect` runs before the browser paints, so the animation starts from the invisible state — the user never sees a flash of un-animated content.

The `[data-flip-id]` selector targets the `data-flip-id` attribute set on each `ExhibitionCard`, making the query resilient to wrapper divs or layout changes.

---

## 12. GridView

**File:** `src/components/exhibitions/GridView.tsx`

The most interactive component. It renders exhibition cards in a draggable grid that the user can pan around.

### Responsive Grid Config

```typescript
const GRID_CONFIG: Record<"mobile" | "desktop", GridConfig> = {
  mobile: { cols: 5, cellW: 240, gap: 60 },
  desktop: { cols: 5, cellW: 400, gap: 120 },
};
```

A custom `useGridConfig` hook uses `window.matchMedia` to detect the breakpoint and returns the appropriate config. This is done in JS (not CSS) because the drag bounds calculation in `useDraggable` needs the actual pixel values.

### Brick Layout (Staggered Rows)

```typescript
const rowOffset = useMemo(() => (cellW + gap) / 2, [cellW, gap]);

{exhibitions.map((ex, i) => {
  const row = Math.floor(i / cols);
  const isOddRow = row % 2 === 0;
  return (
    <div style={isOddRow ? { transform: `translateX(${rowOffset}px)` } : undefined}>
      <ExhibitionCard ... />
    </div>
  );
})}
```

Even-indexed rows (0, 2, 4...) are shifted right by half a cell+gap width, creating a brick/masonry-like stagger. This prevents the grid from looking too rigid and creates visual interest.

### Centering

```typescript
useLayoutEffect(() => {
  const ox = (vp.clientWidth - grid.offsetWidth) / 2;
  const oy = (vp.clientHeight - grid.offsetHeight) / 2;
  gsap.set(grid, { x: ox, y: oy });
  // ... entrance animation
}, [exhibitions, ...]);
```

On mount and when exhibitions change, the grid is centered within the viewport.

### Entrance Animation

```typescript
gsap.fromTo(
  cards,
  { opacity: 0, scale: 0.85 },
  { opacity: 1, scale: 1, duration: 0.6, stagger: 0.03, ease: "power3.out" }
);
```

Cards pop in from 85% scale with a quick 30ms stagger between each.

### Viewport & Drag

The viewport is a `fixed inset-0` div that covers the entire screen. The content grid is `absolute` inside it. The `useDraggable` hook handles all pointer interaction (covered in section 15).

---

## 13. ExhibitionCard

**File:** `src/components/exhibitions/ExhibitionCard.tsx`

A single component that adapts its layout based on the `viewMode` prop:

### List Mode

A horizontal card with:
- A square 133×133px image (full-width on mobile)
- The exhibition title
- An "Explore Story" button with an arrow icon

Layout: `flex-col` on mobile, `flex-row` on desktop (`lg:flex-row lg:items-center`).

### Grid Mode

A vertical card with:
- A 400×280 aspect-ratio image
- The exhibition title below

Both modes use `FallbackImage` for error handling and the `data-flip-id` attribute for animation targeting.

---

## 14. DragIndicator

**File:** `src/components/exhibitions/DragIndicator.tsx`

A floating circular button with a drag icon and "Drag" label. It appears in grid view to hint that the canvas is draggable.

### Hover Animation

On mouse enter:
- Container shrinks from 54×54 to 44×44
- Background darkens slightly (cream → cream-dark)
- Gap collapses to 0
- Text fades out and collapses to 0 height

On mouse leave:
- Everything reverses back

This is done with GSAP on raw `mouseenter`/`mouseleave` DOM events (not React synthetic events) because the animation targets specific measured properties (`width`, `height`, `gap`).

---

## 15. useDraggable Hook

**File:** `src/hooks/useDraggable.ts`

A custom React hook that provides full pointer-drag functionality with elastic boundaries and momentum. This is the physics engine behind the grid view.

### Interface

```typescript
function useDraggable(options?: {
  edgePadding?: number;   // How far past the edge the user can see (default: 100)
  rubberBand?: number;    // Elastic resistance factor (default: 4)
  extraWidth?: number;    // Extra content width to account for (default: 0)
})
```

Returns:
- `viewportRef` — Attach to the scrollable viewport container
- `contentRef` — Attach to the draggable content
- `handlers` — Object with `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`

### Bounds Calculation

```typescript
const getBounds = useCallback(() => {
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
```

The content can be dragged so that at most `edgePadding` pixels of the content remain visible at any edge. `extraWidth` accounts for the brick layout row offset (since translateX shifts some rows beyond the grid's measured width).

### Drag Flow

**On pointer down:**
1. Kill any running momentum animation
2. Record the starting pointer position and the content's current GSAP `x`/`y` position
3. Initialize velocity tracking
4. Capture the pointer (so move/up events keep firing even if the cursor leaves the element)

**On pointer move:**
1. Calculate velocity: `vx = (dx / dt) * 16` — delta pixels per frame at 60fps
2. Compute the desired position: `originX + (currentX - startX)`
3. Apply elastic clamping:

```typescript
function elastic(v, min, max, rubber) {
  if (v > max) return max + (v - max) / rubber;
  if (v < min) return min - (min - v) / rubber;
  return v;
}
```

If the position is within bounds, it passes through unchanged. If it exceeds bounds, the excess is divided by the `rubberBand` factor (4), so the content moves at 1/4 speed past the edge — creating a rubber-band feel.

**On pointer up:**
1. Get the current position and bounds
2. Project the final position: `currentX + vx * 25` (velocity × decay factor)
3. Clamp the projected position to bounds
4. Animate to the clamped position with GSAP:
   - If currently over bounds: 0.5s snap-back (fast rubber-band return)
   - If within bounds: 1.2s coast-to-stop (smooth momentum)

---

## 16. FallbackImage

**File:** `src/components/FallbackImage.tsx`

A wrapper around Next.js `<Image>` that handles load errors gracefully.

```typescript
const [error, setError] = useState(false);
```

If the image fails to load (`onError`), the component renders a placeholder: a dark semi-transparent box with an SVG image icon and the alt text. This prevents broken image indicators in the UI.

The `wrapperClassName` prop allows styling the fallback container to match the image's layout (e.g., `absolute inset-0 rounded-[16px]`).

---

## 17. Icon Components

**Files:** `src/components/icons/`

Three small icon components, all pure SVG:

- **ArrowIcon** — A right-pointing arrow inside a circle. Used in the "Explore Story" button on list cards. Accepts `size` and `className` props.
- **ChevronIcon** — A small downward chevron. Used in the mobile category dropdown trigger. Rotates 180° when open via a CSS class.
- **SocialIcons** — Three named exports (`XIcon`, `YouTubeIcon`, `ContrastIcon`) used in the footer. The contrast icon is a half-filled circle used as the high-contrast mode toggle.

All icons use `currentColor` for fill/stroke, so they inherit color from their parent's `color` CSS property.

---

## 18. Footer

**File:** `src/components/Footer.tsx`

A fixed bottom bar with:

### Left Side
Copyright text with the current year (generated dynamically with `new Date().getFullYear()`).

### Right Side
1. **Social links** — X (Twitter) and YouTube icons, opening in new tabs
2. **Accessibility controls** — A pill-shaped container with three buttons:
   - **Contrast toggle** — Toggles the `high-contrast` class on `<html>`, which swaps CSS variables (dark background → black, cream → white, gold → bright gold)
   - **A+** — Increases the root `font-size` by 2px (max 24px)
   - **A-** — Decreases the root `font-size` by 2px (min 12px)

The font size controls work by setting `document.documentElement.style.fontSize`, which affects all `rem`-based sizes across the app.

---

## 19. Styling & Theme

**File:** `src/app/globals.css`

The app uses **Tailwind CSS 4** with a custom inline theme:

### Custom Colors

| Token | Value | Usage |
| --- | --- | --- |
| `cream` | `#EFEBE5` | Primary text, CTA text, card text |
| `cream-dark` | `#e8e0d0` | Hover state for drag indicator |
| `gold` | `#c9a84c` | Text selection background |
| `dark-blue` | `#253143` | Page background, button text |
| `charcoal` | `#1a1a1a` | Selection text color |
| `separator` | `#C7C6C5` | Filter/toggle background |

### Custom Fonts

| Token | CSS Variable | Font |
| --- | --- | --- |
| `font-patua` | `--font-patua-one` | Patua One |
| `font-playfair` | `--font-playfair-display` | Playfair Display |
| `font-noto` | `--font-noto-sans` | Noto Sans |

### High Contrast Mode

```css
html.high-contrast {
  --background: #000000;
  --foreground: #ffffff;
  --color-cream: #ffffff;
  --color-gold: #ffd700;
}
```

When the contrast toggle is pressed, CSS variables are overridden, and all components using those tokens update automatically.

---

## 20. Animations Summary

| Component | Trigger | Animation | Duration |
| --- | --- | --- | --- |
| Navbar items | Page load | Stagger fade-down (y: -15 → 0) | 0.8s, 120ms stagger |
| Hero heading | Page load (0.8s delay) | Slide up (y: 60 → 0) + fade | 1.2s |
| Hero subtitle | Timeline overlap | Slide up (y: 20 → 0) + fade | 1.0s |
| Hero CTA | Timeline overlap | Slide up (y: 20 → 0) + fade | 0.8s |
| Scroll indicator | Timeline end | Fade in | 1.0s |
| ArtifactDisc inner ring | Continuous | Rotate 360° clockwise | 80s per revolution |
| ArtifactDisc middle ring | Continuous | Rotate 360° counter-clockwise | 100s per revolution |
| ArtifactDisc outer ring | Continuous | Rotate 360° clockwise | 120s per revolution |
| List view cards | Mount / filter change | Stagger slide-up (y: 40 → 0) + fade | 0.6s, 60ms stagger |
| Grid view cards | Mount / filter change | Stagger scale-in (0.85 → 1) + fade | 0.6s, 30ms stagger |
| View toggle indicator | View mode change | Slide to new position | 0.4s |
| Category dropdown (mobile) | Open | Scale Y + slide down + fade | 0.25s |
| Drag indicator hover | Mouse enter | Shrink (54 → 44), text fade out | 0.3s |
| Drag indicator leave | Mouse leave | Expand (44 → 54), text fade in | 0.3s |
| Grid drag (during) | Pointer move | Elastic rubber-band clamping | Instant |
| Grid drag (release) | Pointer up | Momentum coast with clamp | 0.5–1.2s |
