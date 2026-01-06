"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Heart, Target, Lightbulb, Users, Zap } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Passion for Audio",
    description: "We live and breathe sound. Every feature we build comes from our deep love for audio creation.",
  },
  {
    icon: Target,
    title: "User-Focused",
    description: "Your workflow is our priority. We design tools that feel intuitive and empower creativity.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We push the boundaries of what's possible with AI and audio technology.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ColorBends - Full page animated background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section with Waveform */}
        <section className="relative pt-32 pb-20 px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Horizontal Waveform Behind Headline - Full Width Thin */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
              <div className="flex items-center justify-center gap-[2px] opacity-15 w-full px-4">
                {[...Array(120)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-gradient-to-t from-violet-500/80 to-fuchsia-500/80 rounded-full animate-waveform-bar flex-shrink-0"
                    style={{
                      height: `${20 + Math.sin(i * 0.15) * 15}px`,
                      animationDelay: `${i * 0.03}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Badge */}
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <Users className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">Our Story</span>
            </div>

            <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Zenphony Audio
              </span>
            </h1>

            <p className="relative text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
              Zenphony Audio was founded by two hybrid engineers and composers working across popular music and film.
            </p>

            {/* Stats */}
            <div className="relative inline-flex items-center gap-8 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">2025</p>
                <p className="text-sm text-white/50">Founded</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Clarity</p>
                <p className="text-sm text-white/50">Our Focus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-3xl p-8 lg:p-12 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>

              <div className="space-y-4 text-white/60 leading-relaxed">
                <p className="text-lg text-white/80">
                  We build tools that solve problems we've encountered repeatedly in our own work—problems existing audio software never fully addressed.
                </p>
                <p>
                  Our focus is clarity, perception, and decision-making: helping creators understand what they're hearing so they can move forward with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Bouncy Cards with Purple Gradient */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Our Values
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                The principles that guide everything we build
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="group relative animate-float"
                    style={{ animationDelay: `${index * -2}s` }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-purple-600/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Card */}
                    <div className="relative bg-gradient-to-br from-violet-600/10 via-fuchsia-600/5 to-purple-600/10 rounded-2xl p-6 border border-violet-500/20 hover:border-violet-400/40 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-violet-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
