import Link from "next/link"

const footerLinks = [
  { href: "#journey", label: "Journey" },
  { href: "#gallery", label: "Gallery" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#connect", label: "Connect" },
]

export function Footer() {
  return (
    <footer className="relative py-16 bg-background border-t border-border/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.25em] text-foreground hover:text-primary transition-colors"
            >
              O.W.P.I.L
            </Link>
            <p className="mt-2 font-mono text-xs tracking-[0.15em] text-muted-foreground">
              One Without Purpose Is Lost
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            {`© ${new Date().getFullYear()} Tyshawn Morehead. All rights reserved.`}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Designed with purpose.
          </p>
        </div>
      </div>
    </footer>
  )
}
