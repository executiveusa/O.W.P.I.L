import type { Metadata, Viewport } from "next"
import { Playfair_Display, Space_Mono } from "next/font/google"
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

export const metadata: Metadata = {
  title: "O.W.P.I.L — One Without Purpose Is Lost",
  description: "Tyshawn Morehead — Artist, storyteller, and creator. Showing the world how anime is life.",
  keywords: ["Tyshawn Morehead", "OWPIL", "artist", "anime", "purpose", "storyteller"],
  authors: [{ name: "Tyshawn Morehead" }],
  openGraph: {
    title: "O.W.P.I.L — One Without Purpose Is Lost",
    description: "Tyshawn Morehead — Artist, storyteller, and creator.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceMono.variable} bg-background scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
