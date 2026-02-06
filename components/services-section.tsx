"use client"

import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function ServicesSection() {

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10 px-2 sm:px-4 lg:px-8 xl:px-12">
        {/* Split Layout - Editorial Style */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-24 items-center">

          {/* Left Content Block */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8 lg:pr-8 text-center lg:text-left">
            {/* Eyebrow Label */}
            <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <div className="h-px w-6 sm:w-8 bg-gradient-to-r from-violet-500 to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-violet-400">
                Audio Intelligence
              </span>
              <div className="h-px w-6 sm:w-8 bg-gradient-to-l from-violet-500 to-transparent lg:hidden" />
            </div>

            {/* Large Editorial Headline */}
            <div className="px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
                <span className="block pb-1">Meet your</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300">
                  new buddy
                </span>
              </h2>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-white/50 leading-relaxed max-w-lg mx-auto lg:mx-0 px-2">
              AI-powered mix feedback engineered by Zenphony DSP Lab. Real-time spectral intelligence that elevates your sound.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4 px-2">
              <Link href="/products/listen-buddy" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-6 sm:px-8 py-4 sm:py-5 lg:py-6 text-sm sm:text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0"
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
            <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4 sm:pt-6 border-t border-white/10">
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-black text-white">Real-time</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Processing</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-white/10" />
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-black text-white">VST3/AU</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Compatible</p>
              </div>
            </div>
          </div>

          {/* Right Visual Block - Product Mockup */}
          <div className="relative w-full lg:w-[120%] lg:-mr-[20%] aspect-[4/3]">
            {/* Animated Glow Ring */}
            <div className="absolute -inset-6 bg-gradient-to-r from-violet-600/40 via-fuchsia-500/30 to-indigo-600/40 rounded-3xl blur-3xl animate-pulse" />

            {/* Secondary Glow */}
            <div className="absolute -inset-3 bg-gradient-to-br from-violet-500/30 to-transparent rounded-3xl blur-2xl" />

            {/* Main Image Container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 bg-black/20 backdrop-blur-sm shadow-2xl shadow-violet-500/30">
              {/* Plugin Interface Image */}
              <Image
                src="/listen-buddy-plugin-interface-purple.jpg"
                alt="Listen Buddy Plugin Interface"
                fill
                className="object-cover"
                priority
              />

              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* Top Highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-violet-500/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
