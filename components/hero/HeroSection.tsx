"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { OWPILWordmark } from "./OWPILWordmark"
import { ScrollIndicator } from "./ScrollIndicator"
import { useI18n } from "@/lib/i18n/context"

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
  const { t } = useI18n()

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextImage, 3000)
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
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/90" />
        
        {/* Warm cinematic color grade */}
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Main Wordmark */}
        <OWPILWordmark isLoaded={isLoaded} />

        {/* Tagline */}
        <p
          className={`mt-6 font-mono text-sm tracking-[0.25em] text-foreground/70 uppercase ${
            isLoaded ? "animate-reveal" : "opacity-0"
          }`}
        >
          {t("hero.tagline")}
        </p>

        {/* Subtle attribution */}
        <p
          className={`mt-4 font-mono text-xs tracking-wider text-muted-foreground transition-opacity duration-1000 delay-[1.5s] ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          Tyshawn Morehead
        </p>
      </div>

      {/* Image Progress Indicators */}
      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative h-1 w-8 overflow-hidden bg-foreground/20 transition-all hover:bg-foreground/30"
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
