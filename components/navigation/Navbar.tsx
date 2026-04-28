"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { useI18n } from "@/lib/i18n/context"

const sectionLinks = [
  { href: "/#journey",    key: "nav.journey" },
  { href: "/#gallery",    key: "nav.gallery" },
  { href: "/#philosophy", key: "nav.philosophy" },
  { href: "/#connect",    key: "nav.connect" },
]

const pageLinks = [
  { href: "/documentary", key: "nav.documentary" },
  { href: "/merch",       key: "nav.merch" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.2em] text-foreground hover:text-primary transition-colors duration-300"
        >
          O.W.P.I.L
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {sectionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {t(link.key)}
            </Link>
          ))}

          {/* Divider */}
          <span className="mx-2 h-4 w-px bg-border/50" aria-hidden />

          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* X / Twitter */}
          <a
            href="https://x.com/TyshawnMor90261"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tyshawn on X (Twitter)"
            className="ml-1 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.735-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Dashboard CTA */}
          <Link
            href="/dashboard"
            className="ml-3 px-5 py-2 border border-primary/40 bg-primary/10 font-mono text-[11px] tracking-[0.15em] uppercase text-primary hover:bg-primary hover:text-background transition-all duration-300"
          >
            {t("nav.dashboard")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-between w-7 h-5"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`block h-px w-full bg-foreground transition-all duration-300 origin-left ${menuOpen ? "rotate-45 translate-y-px" : ""}`} />
          <span className={`block h-px w-full bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block h-px w-full bg-foreground transition-all duration-300 origin-left ${menuOpen ? "-rotate-45 -translate-y-px" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? "max-h-[32rem]" : "max-h-0"}`}>
        <div className="flex flex-col px-6 pb-8 pt-2 bg-background border-b border-border/30">
          <p className="font-mono text-[9px] tracking-[0.35em] text-muted-foreground/50 uppercase pt-5 pb-3">
            Explore
          </p>
          {sectionLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 font-mono text-sm tracking-[0.15em] uppercase text-muted-foreground border-b border-border/10 hover:text-foreground transition-colors duration-200"
            >
              {t(link.key)}
            </Link>
          ))}

          <p className="font-mono text-[9px] tracking-[0.35em] text-muted-foreground/50 uppercase pt-6 pb-3">
            Pages
          </p>
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 font-mono text-sm tracking-[0.15em] uppercase border-b border-border/10 transition-colors duration-200 ${
                pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}

          <Link
            href="/dashboard"
            className="mt-6 py-4 text-center border border-primary/40 bg-primary/10 font-mono text-sm tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-background transition-all duration-300"
          >
            {t("nav.dashboard")}
          </Link>

          {/* Bottom row — X link + lang + theme */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <a
              href="https://x.com/TyshawnMor90261"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.735-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @TyshawnMor90261
            </a>
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
