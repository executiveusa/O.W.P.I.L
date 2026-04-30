export function MerchHero() {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden border-b border-border/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="relative max-w-7xl mx-auto text-center">
        <span className="font-mono text-xs tracking-[0.4em] text-primary uppercase">
          Official Merch Store
        </span>
        <h1 className="mt-4 sm:mt-6 font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground">
          DUAL: Chapter 1
          <br />
          <span className="text-primary italic">The Knock</span>
        </h1>
        <p className="mt-4 sm:mt-6 max-w-2xl mx-auto font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Printed only when ordered. No waste. No inventory.
          <br className="hidden sm:block" />
          Protected artwork from the O.W.P.I.L universe.
        </p>
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-muted-foreground/60">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Made to order • Worldwide shipping • Artist protected
        </div>
      </div>
    </section>
  )
}
