"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type FallbackImageProps = ImageProps & {
  wrapperClassName?: string;
};

export default function FallbackImage({
  alt,
  wrapperClassName,
  className,
  ...props
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-dark-blue/60 ${wrapperClassName ?? ""}`}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-cream/30"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="font-playfair text-[12px] text-cream/40">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
