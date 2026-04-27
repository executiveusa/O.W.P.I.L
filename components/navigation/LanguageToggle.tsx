"use client"

import { useState, useRef, useEffect } from "react"
import { useI18n, locales, type Locale } from "@/lib/i18n/context"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLocale = locales.find((l) => l.code === locale) || locales[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (code: Locale) => {
    setLocale(code)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3 py-2 rounded-full 
                   bg-card/50 border border-border/50 backdrop-blur-sm
                   hover:bg-card hover:border-primary/50 
                   transition-all duration-300 ease-out"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe 
          className="w-4 h-4 text-primary transition-transform duration-300 
                     group-hover:rotate-12" 
        />
        <span className="font-mono text-xs tracking-wider uppercase text-foreground">
          {currentLocale.code}
        </span>
        <svg
          className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-lg overflow-hidden
                    bg-card/95 border border-border/50 backdrop-blur-md
                    shadow-xl shadow-black/20
                    transition-all duration-300 ease-out origin-top-right
                    ${isOpen 
                      ? "opacity-100 scale-100 translate-y-0" 
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
      >
        {locales.map((l, index) => (
          <button
            key={l.code}
            onClick={() => handleSelect(l.code)}
            className={`w-full flex items-center gap-3 px-4 py-3
                       transition-all duration-200 text-left
                       ${l.code === locale 
                         ? "bg-primary/10 text-primary" 
                         : "text-foreground hover:bg-muted/50 hover:text-primary"
                       }
                       ${index !== locales.length - 1 ? "border-b border-border/30" : ""}`}
          >
            {/* Language indicator dot */}
            <span 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                l.code === locale 
                  ? "bg-primary scale-100" 
                  : "bg-muted-foreground/30 scale-75"
              }`}
            />
            
            {/* Flag and names */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                <span className="font-mono text-xs tracking-wider uppercase">
                  {l.code}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                {l.nativeName}
              </span>
            </div>

            {/* Checkmark for selected */}
            {l.code === locale && (
              <svg 
                className="w-4 h-4 text-primary" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
