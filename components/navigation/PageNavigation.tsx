"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

const sections = [
  { id: "hero-section", name: "Hero" },
  { id: "timeline-section", name: "Timeline" },
  { id: "gallery-section", name: "Gallery" },
  { id: "philosophy-section", name: "Philosophy" },
  { id: "connect-section", name: "Connect" },
]

export function PageNavigation() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id)
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentSectionIndex(i)
          break
        }
      }
      
      setIsVisible(window.scrollY > window.innerHeight / 2)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  const canScrollUp = currentSectionIndex > 0
  const canScrollDown = currentSectionIndex < sections.length - 1

  return (
    <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <button
        onClick={() => scrollToSection(currentSectionIndex - 1)}
        disabled={!canScrollUp}
        className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all ${
          canScrollUp
            ? "bg-background/80 backdrop-blur hover:bg-accent hover:text-background hover:border-accent"
            : "opacity-30 cursor-not-allowed"
        }`}
        aria-label="Previous section"
        title={canScrollUp ? `Go to ${sections[currentSectionIndex - 1].name}` : ""}
      >
        <ArrowUp size={20} />
      </button>

      <div className="flex flex-col gap-2 py-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSectionIndex
                ? "bg-accent w-8"
                : "bg-muted hover:bg-muted/80"
            }`}
            aria-label={`Go to ${section.name}`}
            title={section.name}
          />
        ))}
      </div>

      <button
        onClick={() => scrollToSection(currentSectionIndex + 1)}
        disabled={!canScrollDown}
        className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all ${
          canScrollDown
            ? "bg-background/80 backdrop-blur hover:bg-accent hover:text-background hover:border-accent"
            : "opacity-30 cursor-not-allowed"
        }`}
        aria-label="Next section"
        title={canScrollDown ? `Go to ${sections[currentSectionIndex + 1].name}` : ""}
      >
        <ArrowDown size={20} />
      </button>
    </div>
  )
}
