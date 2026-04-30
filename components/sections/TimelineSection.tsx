"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

type Era = "past" | "present" | "future"

const eras: { key: Era; label: string; subtitle: string }[] = [
  { key: "past",    label: "The Past",    subtitle: "Where it began" },
  { key: "present", label: "The Present", subtitle: "Where it stands" },
  { key: "future",  label: "The Future",  subtitle: "Where it is going" },
]

const timelineData: Record<Era, { period: string; title: string; description: string; detail: string; image?: string }[]> = {
  past: [
    {
      period: "Origins",
      title: "The Foundation",
      description: "Born into a world of stories. Anime arrived first and never left. The roots of purpose planted early through characters who refused to quit.",
      detail: "Every shonen protagonist who got back up — Naruto, Luffy, Goku — became a blueprint. Purpose before passion.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223853-Zd1WofxynLQeIXHsxd4VF21xtFQo2P.jpg",
    },
    {
      period: "Formation",
      title: "Building the Vision",
      description: "Years of study, culture, travel. Europe. The streets. The silence between moments. A worldview forged through experience, not textbooks.",
      detail: "Crossing borders changed the lens. When you see how differently others live, you stop settling for your defaults.",
    },
    {
      period: "The Turning Point",
      title: "One Without Purpose",
      description: "The moment the phrase was born. Not from a book — from a feeling. The recognition that drifting without direction is its own kind of suffering.",
      detail: "O.W.P.I.L was never an acronym first. It was a feeling — one that needed a name.",
    },
  ],
  present: [
    {
      period: "Now",
      title: "Building in Public",
      description: "Creating the documentary. Building the brand. Sharing the philosophy in real time. The work is the message.",
      detail: "Every upload, every frame, every post is part of the living document. The project is ongoing.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223631-StlrMIDhRpmffslz73XRRzYB5PzzZb.jpg",
    },
    {
      period: "Active",
      title: "The Anime Synthesis",
      description: "Weaving anime philosophy into real-world strategy. The lessons of the greatest animated storytellers applied to a life fully lived.",
      detail: "Dragon Ball taught consistency. Fullmetal Alchemist taught equivalent exchange. Hunter x Hunter taught patience under pressure.",
    },
    {
      period: "Community",
      title: "The Network Expands",
      description: "Connecting with creators, thinkers, and seekers from every timezone. The mission scales when the message is clear.",
      detail: "One conversation at a time. One piece of content at a time. The compound effect is real.",
    },
  ],
  future: [
    {
      period: "Fall 2026",
      title: "The Documentary Drops",
      description: "A full-length documentary capturing the journey, the philosophy, and the people who shaped it. Something the world has not seen.",
      detail: "Not a highlight reel. A real document. The kind of film that asks you to sit with discomfort and emerge changed.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223927-zBZWkZCWVe2dUPPHPV4MvRLg6CYypf.jpg",
    },
    {
      period: "Expansion",
      title: "O.W.P.I.L Studios",
      description: "A full creative infrastructure. Production, animation, merchandise, events. The brand becomes a movement with its own gravitational pull.",
      detail: "The goal was never fame. The goal was always to build something that outlasts any one moment.",
    },
    {
      period: "Legacy",
      title: "The Archive",
      description: "A living record — digital, physical, cultural. For the next generation of those who feel lost but are actually just beginning.",
      detail: "Whoever finds this after we are gone will know: purpose was always the answer.",
    },
  ],
}

export function TimelineSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible]       = useState(false)
  const [activeEra, setActiveEra]       = useState<Era>("present")
  const [expanded,  setExpanded]        = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleEraChange = (era: Era) => {
    setActiveEra(era)
    setExpanded(null)
  }

  const items = timelineData[activeEra]
  const featuredImage = items.find(i => i.image)?.image

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-24 md:py-40 bg-background overflow-hidden"
    >
      {/* Background era watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span className="font-serif font-bold text-foreground/[0.018] tracking-widest uppercase"
          style={{ fontSize: "clamp(4rem, 20vw, 18rem)" }}>
          {activeEra}
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">The Journey</span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-wide text-foreground">
            Past. Present. Future.
          </h2>
          <p className="mt-4 font-mono text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
            A visual narrative through time — the evolution of purpose and the pursuit of meaning.
          </p>
        </div>

        {/* Era Tabs */}
        <div className={`flex gap-0 mb-12 sm:mb-16 border-b border-border/30 transition-all duration-1000 delay-200 overflow-x-auto ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {eras.map(({ key, label, subtitle }) => (
            <button
              key={key}
              onClick={() => handleEraChange(key)}
              className={`relative pb-4 sm:pb-5 pr-6 sm:pr-10 text-left group transition-all duration-300 flex-shrink-0 ${
                activeEra === key ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="block font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mb-1 opacity-60">
                {subtitle}
              </span>
              <span className="font-serif text-base sm:text-xl md:text-2xl">
                {label}
              </span>
              <span className={`absolute bottom-0 left-0 h-px bg-primary transition-all duration-500 ${activeEra === key ? "right-4" : "right-full"}`} />
            </button>
          ))}
        </div>

        {/* Content: two-column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-20 items-start">

          {/* Left: timeline items */}
          <div className="relative overflow-x-hidden">
            {/* Vertical track */}
            <div className="absolute left-[7px] top-2 bottom-0 w-px bg-border/25" />

            <div className="space-y-0">
              {items.map((item, index) => (
                <div
                  key={`${activeEra}-${index}`}
                  className={`relative pl-10 pb-10 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                  }`}
                  style={{ transitionDelay: `${index * 140 + 300}ms` }}
                >
                  {/* Dot */}
                  <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-400 ${
                    expanded === index
                      ? "bg-primary border-primary scale-125"
                      : "bg-background border-primary/50 hover:border-primary"
                  }`} />

                  {/* Period label */}
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-primary/70 uppercase">
                    {item.period}
                  </span>

                  {/* Title + expand toggle */}
                  <button
                    onClick={() => setExpanded(expanded === index ? null : index)}
                    className="w-full text-left mt-1.5 group/btn pr-4 sm:pr-0"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <h3 className="font-serif text-lg sm:text-2xl md:text-3xl text-foreground group-hover/btn:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <span className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 mt-1 sm:mt-0 ${expanded === index ? "rotate-90" : ""}`}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </button>

                  {/* Expanded detail */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expanded === index ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}>
                    <div className="border-l-2 border-primary/30 pl-4">
                      <p className="font-mono text-sm text-muted-foreground/80 italic leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className={`mt-8 pt-8 sm:pt-10 border-t border-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-serif text-base sm:text-lg md:text-xl text-foreground">
                The documentary tells what these words cannot.
              </p>
              <a
                href="/documentary"
                className="flex-shrink-0 px-5 sm:px-7 py-2.5 sm:py-3 border border-primary/50 text-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-300 whitespace-nowrap"
              >
                Watch the Film
              </a>
            </div>
          </div>

          {/* Right: featured image */}
          <div className={`hidden lg:block sticky top-32 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative aspect-[3/4] overflow-hidden bg-card/30">
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={`${activeEra} era`}
                  fill
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000"
                  quality={80}
                  sizes="(max-width: 1536px) 360px, 400px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-6xl text-foreground/10 uppercase tracking-widest">
                    {activeEra}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">
                  {eras.find(e => e.key === activeEra)?.label}
                </span>
                <p className="mt-1 font-serif text-lg text-foreground/90">
                  {eras.find(e => e.key === activeEra)?.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
