export function StoreCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        {/* YouTube Shopping section */}
        <div className="border border-border/40 bg-card/20 p-6 sm:p-8">
          <div className="font-mono text-xs tracking-[0.3em] text-primary mb-3">
            COMING SOON
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
            YouTube <span className="text-primary">Shopping</span>
          </h3>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6">
            These products are structured for future Shopify, Fourthwall, and YouTube Shopping integration so merch can appear below videos, Shorts, and live content.
          </p>
          <button className="px-6 py-3 border border-primary/50 text-primary font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary hover:text-background transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Artist Protection section */}
        <div className="border border-border/40 bg-card/20 p-6 sm:p-8">
          <div className="font-mono text-xs tracking-[0.3em] text-primary mb-3">
            FOR CREATORS
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-3">
            Protect Your <span className="text-primary">Artwork</span>
          </h3>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6">
            Artists should own the story behind their work. Learn how to protect, document, and monetize your original artwork using our tools.
          </p>
          <button className="px-6 py-3 bg-primary text-background font-mono text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-all duration-300">
            Explore Tools
          </button>
        </div>
      </div>
    </section>
  )
}
