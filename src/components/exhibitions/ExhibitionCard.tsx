import type { Exhibition, ViewMode } from "@/data/exhibitions";
import FallbackImage from "@/components/FallbackImage";
import ArrowIcon from "@/components/icons/ArrowIcon";

interface ExhibitionCardProps {
  exhibition: Exhibition;
  viewMode: ViewMode;
}

export default function ExhibitionCard({
  exhibition,
  viewMode,
}: ExhibitionCardProps) {
  if (viewMode === "list") {
    return (
      <article
        data-flip-id={exhibition.id}
        className="flex w-full flex-col gap-4 border-b border-[#6D6E7D] pb-[15px] lg:flex-row lg:items-center lg:gap-0"
      >
        <div className="relative aspect-square shrink-0 overflow-hidden rounded-[16px] lg:h-[133px] lg:w-[133px]">
          <FallbackImage
            src={exhibition.image}
            alt={exhibition.title}
            fill
            sizes="(max-width: 1024px) 100vw, 133px"
            className="object-cover"
            wrapperClassName="absolute inset-0 rounded-[16px]"
          />
        </div>

        <h3 className="flex-1 font-playfair text-[24px] font-normal text-cream lg:ml-4 lg:text-[41px]">
          {exhibition.title}
        </h3>

        <button className="flex shrink-0 cursor-pointer items-center gap-[10px] font-playfair text-[14px] font-medium text-cream">
          Explore Story
          <ArrowIcon />
        </button>
      </article>
    );
  }

  return (
    <article data-flip-id={exhibition.id} className="w-full">
      <div className="relative w-full overflow-hidden rounded-[16px]" style={{ aspectRatio: "400/280" }}>
        <FallbackImage
          src={exhibition.image}
          alt={exhibition.title}
          fill
          sizes="(max-width: 1024px) 240px, 400px"
          draggable={false}
          className="object-cover"
          wrapperClassName="absolute inset-0 rounded-[16px]"
        />
      </div>
      <h3 className="mt-4 font-playfair text-[22px] leading-[18px] font-normal text-cream">
        {exhibition.title}
      </h3>
    </article>
  );
}
