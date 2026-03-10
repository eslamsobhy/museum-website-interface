"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { XIcon, YouTubeIcon } from "@/components/icons/SocialIcons";

export default function Footer() {
  const [fontSize, setFontSize] = useState(16);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.min(prev + 2, 24);
      document.documentElement.style.fontSize = `${next}px`;
      return next;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.max(prev - 2, 12);
      document.documentElement.style.fontSize = `${next}px`;
      return next;
    });
  }, []);

  const toggleContrast = useCallback(() => {
    document.documentElement.classList.toggle("high-contrast");
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-[#6D6E7D] bg-dark-blue/90">
      <div className="flex h-full items-center justify-between px-4 lg:px-10">
        <p className="font-playfair text-[12px] font-normal text-white">
          Copyright &copy;{new Date().getFullYear()} Artifacta
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-cream transition-colors duration-200 hover:text-white"
            >
              <XIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-cream transition-colors duration-200 hover:text-white"
            >
              <YouTubeIcon />
            </a>
          </div>

          <div className="flex items-center rounded-[60px] bg-white p-1">
            <button
              onClick={toggleContrast}
              aria-label="Toggle high contrast"
              className="flex cursor-pointer items-center justify-center transition-opacity duration-200 hover:opacity-70"
            >
              <Image src="/toggle-dark-mode-icon.svg" alt="" width={40} height={40} />
            </button>
            <button
              onClick={increaseFontSize}
              aria-label="Increase font size"
              className="flex cursor-pointer items-center justify-center transition-opacity duration-200 hover:opacity-70"
            >
              <Image src="/a+icon.svg" alt="" width={40} height={40} />
            </button>
            <button
              onClick={decreaseFontSize}
              aria-label="Decrease font size"
              className="flex cursor-pointer items-center justify-center transition-opacity duration-200 hover:opacity-70"
            >
              <Image src="/a-icon.svg" alt="" width={40} height={40} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
