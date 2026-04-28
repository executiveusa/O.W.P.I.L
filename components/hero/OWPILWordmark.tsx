"use client"

interface OWPILWordmarkProps {
  isLoaded: boolean
}

export function OWPILWordmark({ isLoaded }: OWPILWordmarkProps) {
  return (
    <div className="flex flex-col items-center gap-0">
      {/* Eyebrow label */}
      <span
        className={`font-mono text-[10px] tracking-[0.5em] text-primary/70 uppercase mb-4 transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        Tyshawn Morehead
      </span>

      {/* Main wordmark — condensed, tight, cinematic */}
      <h1
        className={`font-serif text-[clamp(4rem,14vw,11rem)] leading-none tracking-[0.15em] text-foreground glow-gold glow-pulse transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <span className="text-foreground">O</span>
        <span className="text-primary">.</span>
        <span className="text-foreground">W</span>
        <span className="text-primary">.</span>
        <span className="text-foreground">P</span>
        <span className="text-primary">.</span>
        <span className="text-foreground">I</span>
        <span className="text-primary">.</span>
        <span className="text-foreground">L</span>
      </h1>

      {/* Thin rule */}
      <div
        className={`mt-5 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-1000 ${
          isLoaded ? "w-48 opacity-100" : "w-0 opacity-0"
        }`}
        style={{ transitionDelay: "700ms" }}
      />
    </div>
  )
}
