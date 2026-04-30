"use client"

import { useState } from "react"
import collections from "@/data/merch/collections.json"

interface CollectionFilterProps {
  onFilterChange: (filter: string) => void
}

export function CollectionFilter({ onFilterChange }: CollectionFilterProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const featured = collections.filter(c => c.featured)

  const handleFilterChange = (slug: string) => {
    setActiveFilter(slug)
    onFilterChange(slug)
  }

  return (
    <div className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/20 px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {featured.map(collection => (
          <button
            key={collection.slug}
            onClick={() => handleFilterChange(collection.slug)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs tracking-[0.15em] uppercase border transition-all duration-300 whitespace-nowrap ${
              activeFilter === collection.slug
                ? "bg-primary text-background border-primary"
                : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {collection.name}
          </button>
        ))}
      </div>
    </div>
  )
}
