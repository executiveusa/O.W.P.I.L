"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

interface TimelineItem {
  year: string
  title: string
  description: string
  image?: string
  quote?: string
}

const timelineData: TimelineItem[] = [
  {
    year: "The Past",
    title: "Roots & Foundation",
    description: "Every journey begins with a single step. Born with a vision to bridge cultures through art and storytelling, the foundation was laid in the streets and studios of creativity.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223853-Zd1WofxynLQeIXHsxd4VF21xtFQo2P.jpg",
    quote: "Know thyself, and you will know the universe.",
  },
  {
    year: "The Present",
    title: "The Unfolding",
    description: "Traveling the world, capturing moments that speak louder than words. From the ancient mosaics of monasteries to the shores of distant seas, each location becomes a chapter.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223631-StlrMIDhRpmffslz73XRRzYB5PzzZb.jpg",
    quote: "The present is a gift. Unwrap it daily.",
  },
  {
    year: "The Future",
    title: "Vision Manifest",
    description: "A documentary in progress. A story yet untold. The future holds the convergence of all dreams — anime, art, philosophy, and the human experience woven into one tapestry.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223927-zBZWkZCWVe2dUPPHPV4MvRLg6CYypf.jpg",
    quote: "Purpose is the compass. Passion is the fuel.",
  },
]

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* Image */}
      <div
        className={`relative w-full lg:w-1/2 aspect-[16/10] overflow-hidden transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`w-full lg:w-1/2 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
          {item.year}
        </span>
        <h3 className="mt-3 font-serif text-3xl md:text-4xl tracking-wide text-foreground">
          {item.title}
        </h3>
        <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        {item.quote && (
          <blockquote className="mt-6 border-l-2 border-primary/50 pl-4">
            <p className="font-serif text-lg italic text-foreground/80">
              {`"${item.quote}"`}
            </p>
          </blockquote>
        )}
      </div>
    </div>
  )
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true)
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
      id="journey"
      className="relative py-24 md:py-32 bg-background"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
            The Journey
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground">
            Past. Present. Future.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-muted-foreground">
            A visual narrative through time — documenting the evolution of purpose and the pursuit of meaning.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-24 md:space-y-32">
          {timelineData.map((item, index) => (
            <TimelineCard key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="hidden lg:block absolute left-1/2 top-48 bottom-24 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
    </section>
  )
}
