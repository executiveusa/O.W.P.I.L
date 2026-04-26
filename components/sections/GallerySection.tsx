"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223631-StlrMIDhRpmffslz73XRRzYB5PzzZb.jpg",
    alt: "Coastal Montenegro vista",
    location: "Montenegro",
    category: "Travel",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223853-Zd1WofxynLQeIXHsxd4VF21xtFQo2P.jpg",
    alt: "Ancient mosaics in cave monastery",
    location: "Serbia",
    category: "Culture",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-224050-Uh8NjgGAxZDOmS8yCTtXSDvV1u6cH4.jpg",
    alt: "Serene lakeside reflection",
    location: "Italy",
    category: "Nature",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20201023_163531-lZyrvAJmRZLZI9hYPhBH9mgxXnLhGl.jpg",
    alt: "Historic fortress exploration",
    location: "Belgrade",
    category: "History",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223927-zBZWkZCWVe2dUPPHPV4MvRLg6CYypf.jpg",
    alt: "Mountain valley panorama",
    location: "Montenegro",
    category: "Nature",
  },
]

function Lightbox({
  image,
  onClose,
  onPrev,
  onNext,
}: {
  image: (typeof galleryImages)[0]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-foreground/60 hover:text-foreground transition-colors"
        aria-label="Close lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-4 md:left-8 p-3 text-foreground/60 hover:text-foreground transition-colors"
        aria-label="Previous image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-4 md:right-8 p-3 text-foreground/60 hover:text-foreground transition-colors"
        aria-label="Next image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Image */}
      <div
        className="relative w-full max-w-5xl mx-4 aspect-[16/10]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent">
          <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
            {image.location}
          </p>
          <p className="mt-1 font-serif text-lg text-foreground">{image.alt}</p>
        </div>
      </div>
    </div>
  )
}

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1
      )
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1
      )
    }
  }

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative py-24 md:py-32 bg-card"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
            Visual Stories
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground">
            Gallery
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-muted-foreground">
            Moments captured across continents — each frame a window into different worlds.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              onClick={() => setSelectedIndex(index)}
              className={`group relative aspect-[4/3] overflow-hidden transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
                  {image.location}
                </span>
                <span className="mt-2 font-serif text-lg text-foreground">
                  View
                </span>
              </div>
              {/* Category tag */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm">
                <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  {image.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          image={galleryImages[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  )
}
