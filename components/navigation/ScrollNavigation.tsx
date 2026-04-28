"use client"

import { ArrowUp, ArrowDown } from "lucide-react"

interface ScrollNavigationProps {
  onScrollUp?: () => void
  onScrollDown?: () => void
  canScrollUp?: boolean
  canScrollDown?: boolean
}

export function ScrollNavigation({
  onScrollUp,
  onScrollDown,
  canScrollUp = true,
  canScrollDown = true,
}: ScrollNavigationProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
      <button
        onClick={onScrollUp}
        disabled={!canScrollUp}
        className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all ${
          canScrollUp
            ? "bg-background/50 hover:bg-accent hover:text-background hover:border-accent"
            : "opacity-30 cursor-not-allowed"
        }`}
        aria-label="Scroll up"
        title="Previous section"
      >
        <ArrowUp size={20} />
      </button>
      
      <button
        onClick={onScrollDown}
        disabled={!canScrollDown}
        className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all ${
          canScrollDown
            ? "bg-background/50 hover:bg-accent hover:text-background hover:border-accent"
            : "opacity-30 cursor-not-allowed"
        }`}
        aria-label="Scroll down"
        title="Next section"
      >
        <ArrowDown size={20} />
      </button>
    </div>
  )
}
