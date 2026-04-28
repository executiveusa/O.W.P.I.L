import { HeroSection } from "@/components/hero/HeroSection"
import { Navbar } from "@/components/navigation/Navbar"
import { TimelineSection } from "@/components/sections/TimelineSection"
import { GallerySection } from "@/components/sections/GallerySection"
import { PhilosophySection } from "@/components/sections/PhilosophySection"
import { ConnectSection } from "@/components/sections/ConnectSection"
import { Footer } from "@/components/footer/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <div id="hero-section">
          <HeroSection />
        </div>
        <div id="timeline-section">
          <TimelineSection />
        </div>
        <div id="gallery-section">
          <GallerySection />
        </div>
        <div id="philosophy-section">
          <PhilosophySection />
        </div>
        <div id="connect-section">
          <ConnectSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
