"use client"

import { useRef, useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n/context"

const philosophyItems = [
  {
    number: "01",
    title: "Purpose Over Passion",
    description:
      "Passion fades, but purpose endures. Find your why, and the how becomes inevitable.",
  },
  {
    number: "02",
    title: "Anime Is Life",
    description:
      "The stories we consume shape the stories we become. Animation transcends borders, languages, and time.",
  },
  {
    number: "03",
    title: "Document Everything",
    description:
      "Every moment is a frame in the film of existence. Capture it, preserve it, share it.",
  },
  {
    number: "04",
    title: "Bridge Cultures",
    description:
      "Art is the universal language. Through creation, we connect worlds that were never meant to be separate.",
  },
]

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-serif text-[20vw] font-bold text-foreground/[0.02] tracking-widest select-none">
          PURPOSE
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
            Core Beliefs
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground">
            {t("philosophy.title")}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-mono text-xs sm:text-sm text-muted-foreground">
            The principles that guide the journey — a framework for living with intention.
          </p>
        </div>

        {/* Philosophy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {philosophyItems.map((item, index) => (
            <div
              key={item.number}
              className={`group relative p-6 sm:p-8 border border-border/50 bg-card/50 hover:bg-card transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Number */}
              <span className="absolute top-4 right-4 font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-foreground/[0.05] group-hover:text-primary/10 transition-colors duration-500">
                {item.number}
              </span>

              <div className="relative">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="mt-3 sm:mt-4 font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Quote Block */}
        <div
          className={`mt-16 sm:mt-20 text-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <blockquote className="max-w-3xl mx-auto px-4">
            <p className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl italic text-foreground/90 leading-relaxed">
              &ldquo;{t("hero.tagline")}&rdquo;
            </p>
            <footer className="mt-4 sm:mt-6">
              <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-primary uppercase">
                {t("hero.attribution")}
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
