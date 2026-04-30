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
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201023_165554-LacVRXcI9EcD5iNy5vFQRYbvuuXPr0.jpg",
    alt: "Hand-colored antique world map from the age of exploration",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201023_164559-8YspuoPVnSaFIUTlJqQhEw919YjaG6.jpg",
    alt: "Tyshawn exploring historic fortress weaponry by the Mediterranean",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20200930_084719-nPIBJCfPvnOh6mK3X4XQsyxuB6xzRN.jpg",
    alt: "Tyshawn on boat overlooking Adriatic islands and coast",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201010_224405-TJuCymrpa1nrzJADqvvgYF9fECk1Bx.jpg",
    alt: "Tyshawn with vibrant street art mural under night sky",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201101_145142-sXCs6FW2WBeQah2t3JwaunukpZsFgA.jpg",
    alt: "Tyshawn overlooking Zemun cityscape with Arc of Peace bridge",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201023_224212-copy-0-WX4eb5gz0M8XMFRbDcLqBLtbcoeYVY.jpg",
    alt: "Tyshawn with vibrant artwork in creative studio space",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201001_132037-copy-0-Y4udeKVFlZKLCbl6JW9mefYDqVEz46.jpg",
    alt: "Group gathered at ancient stone fortress ruins",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201010_201108-8g2amC6mMaaZTGzPmwaFxru9zg9ife.jpg",
    alt: "Tyshawn with friends in historic medieval old town",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201019_121946-6brUyIFRLUQX98v8Dt19P7BAlr5HA2.jpg",
    alt: "Tyshawn at Ostrog monastery carved into cliff face",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201029_125818-xvaOITcooXTFTd3f7DxpdM9bkA9iSd.jpg",
    alt: "Tyshawn overlooking vast Adriatic bay with lush islands",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201010_141753-OSh041uNRWh2Wap5DgM2o9txr3CYIc.jpg",
    alt: "Tyshawn on rocky overlook of the Dalmatian coastline",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201023_155640-upgU5dx6RfP0ydAJeve3eHrO7KfbDF.jpg",
    alt: "Tyshawn on fortress wall overlooking the Danube river",
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [quoteVisible, setQuoteVisible] = useState(false)
  const { t } = useI18n()

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
          <div className="mt-6 sm:mt-10 flex flex-col items-center gap-2 sm:gap-3 px-4">
            {/* The quote line in serif italic */}
            <p className="quote-reveal font-serif text-sm sm:text-xl md:text-2xl italic text-foreground/90 tracking-wide max-w-xl leading-relaxed">
              &ldquo;{t("hero.tagline")}&rdquo;
            </p>

            {/* Handwritten attribution — Dancing Script (Tegaki-style) */}
            <span
              className="tegaki-write font-handwriting text-lg sm:text-2xl md:text-3xl text-primary"
              aria-label="Tyshawn Morehead"
            >
              Tyshawn Morehead
            </span>
          </div>
        )}
      </div>

      {/* Image Progress Indicators */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:gap-2 px-4 overflow-x-auto max-w-full">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative h-px w-8 sm:w-10 flex-shrink-0 overflow-hidden bg-foreground/20 transition-all hover:bg-foreground/30"
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
