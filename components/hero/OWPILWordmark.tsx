"use client"

interface OWPILWordmarkProps {
  isLoaded: boolean
}

const letters = ["O", ".", "W", ".", "P", ".", "I", ".", "L"]

export function OWPILWordmark({ isLoaded }: OWPILWordmarkProps) {
  return (
    <h1 className="text-cinematic glow-gold flex items-baseline gap-1 text-6xl font-bold tracking-[0.2em] text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`letter-animate ${letter === "." ? "text-primary" : ""}`}
          style={{
            animationDelay: isLoaded ? `${index * 0.1}s` : "0s",
            opacity: isLoaded ? undefined : 0,
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  )
}
