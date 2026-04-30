"use client"

import { useRef, useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n/context"

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com/tyshawnmorehead", icon: "instagram" },
  { name: "YouTube", href: "https://youtube.com/@tyshawnmorehead", icon: "youtube" },
  { name: "X / Twitter", href: "https://x.com/TyshawnMor90261", icon: "twitter" },
  { name: "Email", href: "mailto:executiveusa@protonmail.me", icon: "email" },
]

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      )
    case "twitter":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      )
    case "email":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    default:
      return null
  }
}

export function ConnectSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="connect"
      className="relative py-16 sm:py-24 md:py-32 bg-card"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side - CTA */}
          <div
            className={`w-full max-w-xl transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="font-mono text-xs tracking-[0.3em] text-primary uppercase">
              {t("connect.subtitle")}
            </span>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide text-foreground">
              {t("connect.title")}
            </h2>
            <p className="mt-3 sm:mt-4 font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Whether you want to collaborate on a project, discuss philosophy over coffee,
              or simply share your favorite anime — the door is always open.
            </p>

            {/* Newsletter signup */}
            <div className="mt-6 sm:mt-8">
              <p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase mb-2 sm:mb-3">
                {t("connect.join")}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-background border border-border font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-mono text-xs tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors whitespace-nowrap">
                  {t("connect.subscribe")}
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Social Links */}
          <div
            className={`w-full transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="group flex flex-col sm:flex-row sm:items-center sm:gap-4 p-3 sm:p-6 border border-border/50 bg-background hover:border-primary/50 transition-all duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                    <SocialIcon icon={link.icon} />
                  </span>
                  <span className="font-mono text-xs sm:text-sm tracking-[0.1em] text-foreground group-hover:text-primary transition-colors">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
