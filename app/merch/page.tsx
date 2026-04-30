"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/Navbar"
import { Footer } from "@/components/footer/Footer"

const products = [
  {
    id: 1,
    name: "O.W.P.I.L Statement Tee",
    price: 38,
    category: "apparel",
    description: "Heavy-weight 100% cotton. Gold embroidered wordmark on chest. Drops in limited quantities.",
    tag: "Signature",
    available: true,
    color: "#1a1a1a",
  },
  {
    id: 2,
    name: "One Without Purpose Hoodie",
    price: 72,
    category: "apparel",
    description: "Heavyweight fleece. The full quote printed inside the collar. Built to last a decade.",
    tag: "Bestseller",
    available: true,
    color: "#2a2a2a",
  },
  {
    id: 3,
    name: "The Journey Photo Print",
    price: 45,
    category: "prints",
    description: "Fine art giclee print from the O.W.P.I.L travels. Signed and numbered. 18x24\".",
    tag: "Limited",
    available: true,
    color: "#1c1c1c",
  },
  {
    id: 4,
    name: "Sensei Anime Poster",
    price: 28,
    category: "prints",
    description: "Original anime-inspired illustration. A tribute to the stories that shaped the journey.",
    tag: "Art",
    available: true,
    color: "#161616",
  },
  {
    id: 5,
    name: "O.W.P.I.L Cap",
    price: 34,
    category: "accessories",
    description: "Structured 6-panel. Gold embroidered logo. One size fits all.",
    tag: "New",
    available: true,
    color: "#0f0f0f",
  },
  {
    id: 6,
    name: "Documentary Zine Vol. 1",
    price: 22,
    category: "media",
    description: "48-page hand-bound zine. Behind-the-scenes of the journey through Europe and beyond.",
    tag: "Collectible",
    available: false,
    color: "#1e1e1e",
  },
]

const categories = ["all", "apparel", "prints", "accessories", "media"]

export default function MerchPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filtered = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">

        {/* Hero Banner */}
        <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <span className="font-mono text-xs tracking-[0.4em] text-primary uppercase">
              The Store
            </span>
            <h1 className="mt-3 sm:mt-4 font-serif text-3xl sm:text-4xl md:text-6xl lg:text-8xl tracking-tight text-foreground">
              O.W.P.I.L
              <br />
              <span className="text-primary italic">Merch</span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-xl mx-auto font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Wearable art. Limited runs. Each piece tells part of the story.
              Own a chapter of the journey.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-muted-foreground/60">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Shipping worldwide — print on demand, made to order
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/20 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 font-mono text-xs tracking-[0.15em] uppercase border transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-background border-primary"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="group relative flex flex-col border border-border/40 bg-card/30 hover:border-primary/40 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Product visual */}
                <div
                  className="relative w-full aspect-square flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: product.color }}
                >
                  {/* Cinematic product placeholder */}
                  <div className="text-center px-6 sm:px-8 select-none">
                    <p className="font-serif text-2xl sm:text-3xl font-bold text-white/10 group-hover:text-white/20 transition-all duration-700 tracking-widest">
                      O.W.P.I.L
                    </p>
                    <p className="mt-2 font-mono text-xs text-white/20 tracking-[0.3em] uppercase">
                      {product.category}
                    </p>
                  </div>

                  {/* Tag badge */}
                  <span className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 sm:px-3 py-1 bg-primary text-background font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase">
                    {product.tag}
                  </span>

                  {/* Unavailable overlay */}
                  {!product.available && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase border border-border px-3 sm:px-4 py-2">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  {/* Hover bottom bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-500 ${hoveredId === product.id ? "opacity-100" : "opacity-0"}`} />
                </div>

                {/* Product info */}
                <div className="flex flex-col flex-1 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <h3 className="font-serif text-base sm:text-lg text-foreground leading-snug">
                      {product.name}
                    </h3>
                    <span className="flex-shrink-0 font-mono text-base sm:text-lg text-primary font-bold">
                      ${product.price}
                    </span>
                  </div>
                  <p className="mt-2 sm:mt-3 font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-auto pt-4 sm:pt-6">
                    <button
                      disabled={!product.available}
                      className={`w-full py-2.5 sm:py-3 font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                        product.available
                          ? "bg-primary text-background hover:bg-primary/90"
                          : "bg-border/20 text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {product.available ? "Add to Cart" : "Notify Me"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 sm:mt-24 text-center border-t border-border/30 pt-12 sm:pt-16">
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3 sm:mb-4">
              Custom orders available
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground">
              Want something <span className="italic text-primary">different?</span>
            </h3>
            <p className="mt-3 sm:mt-4 font-mono text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Bulk orders, custom prints, and collaboration requests — reach out directly.
            </p>
            <a
              href="mailto:contact@owpil.com"
              className="mt-6 sm:mt-8 inline-block px-6 sm:px-8 py-3 sm:py-4 border border-primary/50 text-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-background transition-all duration-300"
            >
              Get in touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
