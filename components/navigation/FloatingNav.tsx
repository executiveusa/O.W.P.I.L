"use client"

import { useState, useEffect, useCallback } from "react"

const sections = [
  { id: "hero-section", label: "Home" },
  { id: "timeline-section", label: "Journey" },
  { id: "gallery-section", label: "Gallery" },
  { id: "philosophy-section", label: "Philosophy" },
  { id: "connect-section", label: "Connect" },
]

export function FloatingNav() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [])

  const goNext = useCallback(() => {
    const next = Math.min(activeIndex + 1, sections.length - 1)
    scrollToSection(sections[next].id)
  }, [activeIndex, scrollToSection])

  const goPrev = useCallback(() => {
    const prev = Math.max(activeIndex - 1, 0)
    scrollToSection(sections[prev].id)
  }, [activeIndex, scrollToSection])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach((section, index) => {
      const el = document.getElementById(section.id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index)
            setVisible(index > 0)
          }
        },
        { threshold: 0.4, rootMargin: "-10% 0px -10% 0px" }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext()
      if (e.key === "ArrowUp") goPrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goNext, goPrev])

  return (
    <div
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="navigation"
      aria-label="Section navigation"
    >
      {/* Up arrow */}
      <button
        onClick={goPrev}
        disabled={activeIndex === 0}
        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
        aria-label="Previous section"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots */}
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative flex items-center justify-center w-6 h-6"
          aria-label={`Go to ${section.label}`}
        >
          {/* Tooltip */}
          <span className="absolute right-8 whitespace-nowrap font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {section.label}
          </span>

          <span
            className={`block rounded-full transition-all duration-300 nav-dot ${
              index === activeIndex
                ? "w-2 h-2 bg-primary nav-dot-active shadow-[0_0_8px_rgba(196,162,101,0.6)]"
                : "w-1.5 h-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        </button>
      ))}

      {/* Down arrow */}
      <button
        onClick={goNext}
        disabled={activeIndex === sections.length - 1}
        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
        aria-label="Next section"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Section counter */}
      <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 mt-1">
        {String(activeIndex + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}
      </span>
    </div>
  )
}
