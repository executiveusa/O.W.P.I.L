"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function DocumentaryPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/documentary/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error("Signup failed")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Film grain */}
      <div className="film-grain" aria-hidden="true" />

      {/* Back nav */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
      </div>

      {/* Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VideoCapture_20201022-223927-zBZWkZCWVe2dUPPHPV4MvRLg6CYypf.jpg"
            alt="O.W.P.I.L Documentary"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/95" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Pre-label */}
          <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-primary mb-6">
            Coming Fall 2026
          </p>

          {/* Title */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wide text-foreground leading-tight">
            O.W.P.I.L
          </h1>

          <div className="mt-3 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-primary/60" />
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
              One Without Purpose Is Lost
            </p>
            <div className="h-px w-12 bg-primary/60" />
          </div>

          <p className="mt-4 font-serif text-2xl md:text-3xl italic text-foreground/80">
            The Documentary
          </p>

          <p className="mt-8 font-mono text-sm leading-relaxed text-muted-foreground max-w-xl mx-auto">
            A cinematic journey through purpose, identity, and the pursuit of meaning.
            The story of Tyshawn Morehead — told through his own eyes.
          </p>

          {/* Scroll cue */}
          <div className="mt-12 flex flex-col items-center gap-2 animate-pulse-down">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50">Sign up below</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Sign-up funnel */}
      <section className="relative py-24 md:py-32 px-6 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-primary">
            Exclusive Access
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl tracking-wide text-foreground">
            Be Part of the Story
          </h2>
          <p className="mt-6 font-mono text-sm leading-relaxed text-muted-foreground">
            Sign up for behind-the-scenes access, exclusive updates, and a chance to
            win free O.W.P.I.L gear and other prizes. Be first in line when the documentary drops.
          </p>

          {/* Prizes list */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Behind-the-Scenes", desc: "Exclusive footage & updates" },
              { label: "Free OPAL Gear", desc: "Win hats, shirts & merch" },
              { label: "First Access", desc: "Early screening invitations" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-border/50 rounded-sm p-4 bg-card/30 hover:border-primary/30 transition-colors"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-1">
                  {item.label}
                </p>
                <p className="font-mono text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="mt-12">
            {submitted ? (
              <div className="border border-primary/30 rounded-sm p-8 bg-primary/5">
                <p className="font-serif text-2xl italic text-foreground mb-2">
                  You&apos;re on the list.
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  We&apos;ll be in touch when things get real. Stay ready.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <div className="h-px w-8 bg-primary/50" />
                  <span className="font-handwriting text-xl text-primary">Tyshawn Morehead</span>
                  <div className="h-px w-8 bg-primary/50" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-card/50 border border-border rounded-sm font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-background font-mono text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  {loading ? "..." : "Join"}
                </button>
              </form>
            )}

            {error && (
              <p className="mt-3 font-mono text-xs text-destructive">{error}</p>
            )}

            <p className="mt-4 font-mono text-[10px] text-muted-foreground/50 tracking-wider">
              No spam. Unsubscribe anytime. Your info goes directly to Tyshawn.
            </p>
          </div>
        </div>
      </section>

      {/* Closing cinematic quote */}
      <section className="py-24 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-4xl italic text-foreground/80 leading-relaxed">
            &ldquo;Purpose is not found. It is forged — through every loss, every lesson, every mile traveled in the dark.&rdquo;
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-primary/50" />
            <span className="font-handwriting text-xl text-primary">Tyshawn Morehead</span>
            <div className="h-px w-8 bg-primary/50" />
          </div>
        </div>
      </section>
    </div>
  )
}
