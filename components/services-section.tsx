"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const galleryImages = [
  { src: "/listen-buddy-film.jpg", alt: "Listen Buddy - Film Mode Analysis" },
  { src: "/listen-buddy-commercial.jpg", alt: "Listen Buddy - Commercial Mode Analysis" },
  { src: "/listen-buddy-mix.jpg", alt: "Listen Buddy - Mix Mode Analysis" },
]

export function ServicesSection() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % galleryImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10 px-4 sm:px-8 lg:px-12">
        {/* Split Layout - Editorial Style */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">

          {/* Left Content Block */}
          <div className="space-y-8 lg:pr-8 text-center lg:text-left">
            {/* Eyebrow Label */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-violet-500 to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
                Audio Intelligence
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-violet-500 to-transparent lg:hidden" />
            </div>

            {/* Large Editorial Headline */}
            <div className="px-2 sm:px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
                <span className="block pb-1">Meet your</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300">
                  new buddy
                </span>
              </h2>
            </div>

            {/* Supporting Copy */}
            <p className="text-lg lg:text-xl text-white/50 leading-relaxed max-w-lg mx-auto lg:mx-0">
              AI-powered mix feedback engineered by Zenphony DSP Lab. Real-time spectral intelligence that elevates your sound.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/products/listen-buddy">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-6 text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0"
                >
                  Explore Listen Buddy
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-white/40 hover:text-white transition-colors flex items-center gap-2 group"
              >
                Learn more
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Subtle Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/10">
              <div>
                <p className="text-2xl font-black text-white">Real-time</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Processing</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white">VST3/AU</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Compatible</p>
              </div>
            </div>
          </div>

          {/* Right Visual Block - Product Mockup Gallery */}
          <div className="relative w-full min-h-[50vh] lg:min-h-[60vh] aspect-[16/10]">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-fuchsia-600/20 rounded-3xl blur-3xl scale-95" />

            {/* Reflection/Depth Layer */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-violet-500/20 rounded-full blur-2xl" />

            {/* Main Mockup Container */}
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 50%, rgba(139, 92, 246, 0.1) 100%)",
                transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Inner Border Glow */}
              <div className="absolute inset-0 rounded-2xl border border-white/10" />
              <div className="absolute inset-px rounded-2xl border border-violet-500/20" />

              {/* Gallery Images with Fade Transition */}
              {galleryImages.map((image, index) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`object-contain transition-opacity duration-1000 ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                  priority={index === 0}
                />
              ))}

              {/* Overlay Gradients for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-900/30 via-transparent to-indigo-900/30" />

              {/* Top Highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* Floating UI Elements */}
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-white/80">Live Analysis</span>
              </div>

              <div className="absolute bottom-6 right-6 flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-violet-400 rounded-full animate-waveform-bar" />
                  <div className="w-1 h-6 bg-violet-400 rounded-full animate-waveform-bar" style={{ animationDelay: "0.1s" }} />
                  <div className="w-1 h-3 bg-violet-400 rounded-full animate-waveform-bar" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1 h-5 bg-violet-400 rounded-full animate-waveform-bar" style={{ animationDelay: "0.3s" }} />
                </div>
                <span className="text-xs font-medium text-white/60">Spectral View</span>
              </div>

              {/* Gallery Dots Indicator */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? "bg-violet-400 w-6"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
