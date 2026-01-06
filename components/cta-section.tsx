"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative py-24 px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto z-10">
        {/* 3D Waveform Sphere - Bouncy Orb */}
        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-indigo-500/40 blur-3xl animate-pulse" />

            {/* Rotating rings */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute inset-4 rounded-full border border-violet-500/30" style={{ transform: "rotateX(75deg)" }} />
            </div>
            <div className="absolute inset-0 animate-spin-slow-reverse">
              <div className="absolute inset-8 rounded-full border border-fuchsia-500/40" style={{ transform: "rotateX(75deg)" }} />
            </div>
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: "12s" }}>
              <div className="absolute inset-2 rounded-full border border-indigo-500/20" style={{ transform: "rotateX(75deg) rotateY(30deg)" }} />
            </div>

            {/* Floating bouncy orb */}
            <div className="absolute inset-12 animate-float">
              {/* Core sphere */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-600/80 via-fuchsia-600/60 to-indigo-500/80 shadow-2xl shadow-violet-500/40">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/20" />

                {/* Waveform bars on sphere */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-white/80 rounded-full animate-waveform-bar"
                      style={{
                        height: `${25 + Math.sin(i * 0.8) * 20}%`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: "8s" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
            </div>
            <div className="absolute inset-0 animate-spin-slow-reverse" style={{ animationDuration: "10s" }}>
              <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-400/50" />
            </div>
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: "15s" }}>
              <div className="absolute top-1/4 left-0 w-2 h-2 rounded-full bg-violet-300 shadow-lg shadow-violet-300/50" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
              Transform
            </span>
            <br />
            Your Sound?
          </h2>

          <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Join creators who trust Zenphony to elevate their audio with AI-powered intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products/listen-buddy">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-10 py-6 text-lg shadow-[0_8px_40px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_50px_rgba(139,92,246,0.6)] transition-all duration-300 border-0"
              >
                Explore Listen Buddy
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 font-semibold px-10 py-6 text-lg bg-transparent transition-all duration-300"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
