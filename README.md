# Artifacta — Museum Website Interface

A museum exhibition website built with **Next.js 16**, **Tailwind CSS 4**, and **GSAP 3** animations. It features a cinematic hero page with animated concentric SVG rings and a dual-mode (list / draggable grid) exhibition browser.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

| Command | Description |
| --- | --- |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS 4** (custom theme tokens)
- **GSAP 3** (timeline animations, drag momentum)

## Notes & Challenges

- **SVG hydration mismatch** — Floating-point differences between server and client rendering caused hydration errors on the concentric-ring SVG. Solved by dynamically importing `ArtifactDisc` with `ssr: false` and using the SVG-native `rotate(angle cx cy)` transform attribute instead of GSAP CSS transforms.
- **Rounded arc geometry** — Building the concentric rings required computing arc paths with rounded corners manually in SVG. Each arc is a custom `<path>` that combines outer/inner arcs with small corner-radius arcs at all four tips, all calculated from trigonometry.
- **Elastic drag with momentum** — The grid view needed to feel physical. A custom `useDraggable` hook tracks pointer velocity per frame and applies a clamped momentum animation on release, with rubber-band resistance when dragging past content bounds.
- **Consistent arc lengths** — The three rings have different radii but need visually consistent arc lengths. The arc length is computed once from the inner ring and then the angular span for middle/outer rings is derived from that fixed length, so arcs shrink in angle as the radius grows.
- **Image fallbacks** — External Unsplash images can fail. A `FallbackImage` wrapper catches `onError` and renders a placeholder SVG icon with the alt text, preventing broken images.
- **Responsive grid config** — The draggable grid uses a `matchMedia` listener to swap between mobile and desktop cell sizes live, rather than relying on CSS breakpoints, because the drag bounds calculation needs the actual pixel values.
