"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const navLinks = [
  { href: "#journey", label: "Journey" },
  { href: "#gallery", label: "Gallery" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#connect", label: "Connect" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.2em] text-foreground transition-colors hover:text-primary"
          >
            O.W.P.I.L
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="ml-4 px-4 py-2 bg-accent/10 border border-accent/30 rounded-md font-mono text-xs tracking-[0.15em] uppercase text-accent transition-all hover:bg-accent hover:text-background"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-8 h-6 flex flex-col justify-between"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-foreground transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            menuOpen ? "max-h-80 opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm tracking-[0.15em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dashboard Link for mobile */}
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="mt-4 px-4 py-3 bg-accent/10 border border-accent/30 rounded-md font-mono text-sm tracking-[0.15em] uppercase text-accent text-center transition-all hover:bg-accent hover:text-background"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
