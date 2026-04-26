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
        <HeroSection />
        <TimelineSection />
        <GallerySection />
        <PhilosophySection />
        <ConnectSection />
      </main>
      <Footer />
    </>
  )
}
