"use client"

import { useState } from "react"
import { Navbar } from "@/components/navigation/Navbar"
import { Footer } from "@/components/footer/Footer"
import { MerchHero } from "@/components/merch/MerchHero"
import { CollectionFilter } from "@/components/merch/CollectionFilter"
import { ProductGrid } from "@/components/merch/ProductGrid"
import { ProtectedMerchExplainer } from "@/components/merch/ProtectedMerchExplainer"
import { StoreCTA } from "@/components/merch/StoreCTA"

export default function MerchPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <MerchHero />
        <CollectionFilter onFilterChange={setActiveFilter} />
        
        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <ProductGrid filter={activeFilter} />
        </section>

        {/* Protected Merch Explainer */}
        <ProtectedMerchExplainer />

        {/* Store CTAs */}
        <StoreCTA />

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center border-t border-border/30">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3 sm:mb-4">
            Custom Orders Available
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
        </section>
      </main>
      <Footer />
    </>
  )
}
