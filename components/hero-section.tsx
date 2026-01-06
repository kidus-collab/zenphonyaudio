"use client"

import { useState, useEffect } from "react"
import { CircularWaveform } from "./circular-waveform"
import { Play, Sparkles } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300 font-medium">AI-Powered Audio Tools</span>
        </div>

        {/* Main Headline */}
        <div className="pt-4 sm:pt-6 px-6 sm:px-10 lg:px-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1] mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 font-[family-name:var(--font-alphacorsa)] italic pb-3 pt-4 pl-3">
              Intelligence
            </span>
            <span className="block text-white/80 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">for Sound</span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
          Zenphony Audio builds intelligent tools that help humans hear more clearly, decide faster, and trust their sound.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/products/listen-buddy"
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-full shadow-lg shadow-violet-600/25 hover:shadow-violet-500/30 transition-all duration-200"
          >
            <Play className="w-5 h-5" />
            Explore Listen Buddy
          </a>
          <a
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-full transition-all duration-200"
          >
            Who We Are
          </a>
        </div>
      </div>

      {/* Compact Orb Section */}
      <div className={`relative z-10 mt-16 lg:mt-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative flex items-center justify-center">
          {/* Circular Waveform - Smaller on all screens */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="scale-[0.35] sm:scale-[0.45] lg:scale-[0.5] xl:scale-[0.55] origin-center">
              <CircularWaveform size={480} bars={64} />
            </div>
          </div>

          {/* Floating orb - Smaller */}
          <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 animate-float">
            {/* Soft glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-purple-500/20 blur-2xl" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10 backdrop-blur-sm border border-white/10" />

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-violet-400/60">
                ♪
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-scroll-wheel" />
        </div>
        <span className="text-xs text-white/30 uppercase tracking-wider">Scroll</span>
      </div>
    </section>
  )
}
