"use client";

import { useState, useCallback, useMemo } from "react";
import { exhibitions, type Category, type ViewMode } from "@/data/exhibitions";
import CategoryFilter from "./CategoryFilter";
import ViewToggle from "./ViewToggle";
import ListView from "./ListView";
import GridView from "./GridView";

export default function ExhibitionsList() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeCategory, setActiveCategory] = useState<Category>("All Objects");

  const filtered = useMemo(
    () =>
      activeCategory === "All Objects"
        ? exhibitions
        : exhibitions.filter((e) => e.category === activeCategory),
    [activeCategory]
  );

  const handleViewChange = useCallback(
    (mode: ViewMode) => {
      if (mode !== viewMode) setViewMode(mode);
    },
    [viewMode]
  );

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  return (
    <>
      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
      <ViewToggle viewMode={viewMode} onChange={handleViewChange} />

      {viewMode === "list" ? (
        <ListView exhibitions={filtered} />
      ) : (
        <GridView exhibitions={filtered} />
      )}
    </>
  );
}
