import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MarqueeSection } from "@/components/marquee-section"
import { ServicesSection } from "@/components/services-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ColorBends - Full page animated background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <MarqueeSection />
        <ServicesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
