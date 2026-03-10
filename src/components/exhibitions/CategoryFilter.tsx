"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { categories, type Category } from "@/data/exhibitions";
import ChevronIcon from "@/components/icons/ChevronIcon";

interface CategoryFilterProps {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryFilter({
  active,
  onChange,
}: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    if (open) {
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: -8, scaleY: 0.95 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.25, ease: "power3.out" }
      );
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [open]);

  return (
    <nav
      aria-label="Exhibition categories"
      className="fixed left-0 top-[140px] z-50 flex w-full justify-center"
    >
      {/* Desktop: horizontal pill row */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="hidden h-[50px] items-center gap-[25px] rounded-[80px] bg-separator px-[6px] py-[5px] lg:flex"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => onChange(cat)}
            className={`cursor-pointer whitespace-nowrap font-playfair text-[16px] font-normal text-dark-blue transition-all duration-300 ${
              active === cat
                ? "rounded-[50px] bg-cream p-[10px]"
                : "bg-transparent px-1 hover:opacity-70"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile: dropdown */}
      <div ref={dropdownRef} className="relative lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-[50px] cursor-pointer items-center gap-2 rounded-[80px] bg-separator px-5 py-[5px] font-playfair text-[16px] font-normal text-dark-blue"
        >
          <span className="rounded-full bg-cream px-[14px] py-2">
            {active}
          </span>
          <ChevronIcon
            className={`text-dark-blue transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {open && (
          <div
            ref={listRef}
            role="listbox"
            aria-label="Select category"
            className="absolute left-1/2 mt-2 min-w-[200px] -translate-x-1/2 overflow-hidden rounded-[20px] bg-separator px-[6px] py-2 origin-top"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                role="option"
                aria-selected={active === cat}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                className={`block w-full cursor-pointer whitespace-nowrap rounded-[14px] px-4 py-[10px] text-left font-playfair text-[15px] font-normal text-dark-blue transition-all duration-200 ${
                  active === cat
                    ? "bg-cream"
                    : "bg-transparent hover:bg-cream/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
