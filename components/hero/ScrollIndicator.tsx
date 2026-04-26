"use client"

import { ChevronDown } from "lucide-react"

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5 animate-pulse-down text-primary" />
      </div>
    </div>
  )
}
