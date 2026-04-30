"use client"

import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: number
  slug: string
  name: string
  price: number
  compareAtPrice: number
  image: string
  shortDescription: string
  collection: string
  protected: boolean
  digital: boolean
  status: "live" | "coming-soon"
  featured?: boolean
}

export function ProductCard({
  slug,
  name,
  price,
  compareAtPrice,
  image,
  shortDescription,
  collection,
  protected: isProtected,
  digital,
  status,
}: ProductCardProps) {
  const isComingSoon = status === "coming-soon"
  const discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)

  return (
    <Link href={isComingSoon ? "#" : `/merch/${slug}`}>
      <div className={`group relative flex flex-col border border-border/40 bg-card/30 overflow-hidden transition-all duration-500 hover:border-primary/60 ${isComingSoon ? "opacity-75" : ""}`}>
        {/* Product Image */}
        <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden bg-background/50">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Sale badge */}
          {discountPercent > 0 && !isComingSoon && (
            <div className="absolute top-3 left-3 z-10 bg-primary text-background px-2 py-1 font-mono text-[10px] tracking-wider">
              -{discountPercent}%
            </div>
          )}

          {/* Protection badge */}
          {isProtected && !isComingSoon && (
            <div className="absolute top-3 right-3 z-10 bg-background/80 border border-primary/60 text-primary px-2 py-1 font-mono text-[10px] tracking-wider">
              Protected
            </div>
          )}

          {/* Digital badge */}
          {digital && !isComingSoon && (
            <div className="absolute bottom-3 right-3 z-10 bg-secondary text-secondary-foreground px-2 py-1 font-mono text-[10px] tracking-wider">
              Digital
            </div>
          )}

          {/* Coming soon overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-20">
              <div className="text-center">
                <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Coming Soon
                </p>
              </div>
            </div>
          )}

          {/* Hover line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-500 opacity-0 group-hover:opacity-100" />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          {/* Collection badge */}
          <div className="mb-2">
            <span className="inline-block font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              {collection}
            </span>
          </div>

          {/* Name and Price */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-sm sm:text-base text-foreground leading-snug flex-1">
              {name}
            </h3>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-base sm:text-lg text-primary font-bold">
                ${price}
              </span>
              {compareAtPrice > price && (
                <span className="font-mono text-xs text-muted-foreground line-through">
                  ${compareAtPrice}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {shortDescription}
          </p>

          {/* CTA */}
          <button
            disabled={isComingSoon}
            className={`w-full py-2.5 font-mono text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
              isComingSoon
                ? "bg-border/20 text-muted-foreground cursor-not-allowed"
                : "bg-primary text-background hover:bg-primary/90 active:scale-95"
            }`}
          >
            {isComingSoon ? "Notify Me" : "View Product"}
          </button>
        </div>
      </div>
    </Link>
  )
}
