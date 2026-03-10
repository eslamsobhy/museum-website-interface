import ExhibitionsList from "@/components/exhibitions/ExhibitionsList";

export const metadata = {
  title: "Exhibitions — Artifacta",
  description: "Browse our collection of objects, voices and global journeys.",
};

export default function ExhibitionsPage() {
  return (
    <>
      {/* Decorative SVG mask overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/imgs-mask.svg"
          alt=""
          className="absolute top-[-1000.39px] right-[-559.15px] h-[2695.11px] w-[2667.3px] rotate-[-86.67deg] opacity-100"
        />
      </div>
      <ExhibitionsList />
    </>
  );
}
