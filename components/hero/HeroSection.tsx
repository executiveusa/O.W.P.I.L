"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { OWPILWordmark } from "./OWPILWordmark"
import { ScrollIndicator } from "./ScrollIndicator"

const heroImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223631-StlrMIDhRpmffslz73XRRzYB5PzzZb.jpg",
    alt: "Tyshawn overlooking the Adriatic coast in Montenegro",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223853-Zd1WofxynLQeIXHsxd4VF21xtFQo2P.jpg",
    alt: "Tyshawn viewing ancient mosaics in a sacred cave",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-224050-Uh8NjgGAxZDOmS8yCTtXSDvV1u6cH4.jpg",
    alt: "Tyshawn contemplating by a serene mountain lake",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201023_163531-lZyrvAJmRZLZI9hYPhBH9mgxXnLhGl.jpg",
    alt: "Tyshawn atop a historic tank at a European fortress",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223927-zBZWkZCWVe2dUPPHPV4MvRLg6CYypf.jpg",
    alt: "Tyshawn overlooking a vast mountain valley",
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    // Trigger quote after wordmark loads
    const t = setTimeout(() => setQuoteVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextImage, 4000)
    return () => clearInterval(interval)
  }, [nextImage])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Film Grain Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 hero-image ${
              index === currentIndex ? "hero-image-active" : "hero-image-inactive"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Cinematic gradient — heavier at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Wordmark */}
        <OWPILWordmark isLoaded={isLoaded} />

        {/* Quote block — Tegaki-inspired handwriting animation */}
        {quoteVisible && (
          <div className="mt-10 flex flex-col items-center gap-3">
            {/* The quote line in serif italic */}
            <p className="quote-reveal font-serif text-xl md:text-2xl italic text-foreground/90 tracking-wide max-w-xl">
              &ldquo;One Without Purpose Is Lost&rdquo;
            </p>

            {/* Handwritten attribution — Dancing Script (Tegaki-style) */}
            <span
              className="tegaki-write font-handwriting text-2xl md:text-3xl text-primary"
              aria-label="Tyshawn Morehead"
            >
              Tyshawn Morehead
            </span>

            {/* Attribution line */}
            <div className="attribution-appear flex items-center gap-3 mt-1">
              <div className="h-px w-8 bg-primary/50" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                O.W.P.I.L
              </span>
              <div className="h-px w-8 bg-primary/50" />
            </div>
          </div>
        )}
      </div>

      {/* Image Progress Indicators */}
      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative h-px w-10 overflow-hidden bg-foreground/20 transition-all hover:bg-foreground/30"
            aria-label={`Go to image ${index + 1}`}
          >
            {index === currentIndex && (
              <div className="progress-bar absolute inset-0 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  )
}
