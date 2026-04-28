import type { Metadata, Viewport } from "next"
import { Playfair_Display, Space_Mono, Dancing_Script } from "next/font/google"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { I18nProvider } from "@/lib/i18n/context"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dancing",
  display: "swap",
})

export const metadata: Metadata = {
  title: "O.W.P.I.L — One Without Purpose Is Lost",
  description: "Tyshawn Morehead — Artist, storyteller, and creator. Showing the world how anime is life.",
  keywords: ["Tyshawn Morehead", "OWPIL", "artist", "anime", "purpose", "storyteller"],
  authors: [{ name: "Tyshawn Morehead" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OWPIL",
  },
  openGraph: {
    title: "O.W.P.I.L — One Without Purpose Is Lost",
    description: "Tyshawn Morehead — Artist, storyteller, and creator.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${spaceMono.variable} ${dancingScript.variable} scroll-smooth`}
    >
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
