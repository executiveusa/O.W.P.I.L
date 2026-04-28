"use client"

import { useState, useRef, useEffect } from "react"
import { useI18n, locales } from "@/lib/i18n/context"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const current = locales.find((l) => l.code === locale) ?? locales[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1.5 h-8 px-2 font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <span aria-hidden>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 top-full mt-1 min-w-[120px] bg-background/98 border border-border/60 backdrop-blur-md shadow-xl z-50 overflow-hidden"
        >
          {locales.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale}>
              <button
                onClick={() => { setLocale(l.code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-left transition-colors duration-150 ${
                  l.code === locale
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <span aria-hidden>{l.flag}</span>
                <span>{l.nativeName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
