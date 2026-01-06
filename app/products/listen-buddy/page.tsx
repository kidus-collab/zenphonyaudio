"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Headphones, BarChart3, Waves, Zap, Music, Mic, Download, Play, Sparkles, MessageCircle, Library, Settings2, Film, Megaphone, Crown, AudioWaveform } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const listeningModes = [
  { icon: Music, label: "Mixing", desc: "Balance, clarity, and translation" },
  { icon: AudioWaveform, label: "Production", desc: "Instrumentation and Arrangement" },
  { icon: Crown, label: "Mastering", desc: "Final polish and consistency" },
  { icon: Mic, label: "Podcast", desc: "Clarity and presence" },
  { icon: Film, label: "Film", desc: "Dialogue and cinematic balance" },
  { icon: Megaphone, label: "Commercial", desc: "Attention-focused sound" },
]

const exampleInsights = [
  "The vocal is competing with the synth pad in the 2-4kHz range. Consider ducking the pad during vocal phrases or carving out space with a dynamic EQ.",
  "Stereo image instability is occurring because transient content is pulling center information leftward during the chorus sections.",
  "Compression timing is reducing rhythmic definition. Consider adjusting attack and release to let more transients through.",
]

const features = [
  {
    icon: Headphones,
    title: "Reference Comparison",
    description: "Compare against professional tracks",
    image: "/abstract-3d-purple-headphones-floating-neon-glow.jpg",
    gradientStyle: "linear-gradient(135deg, #f59e0b, #f97316, #ef4444)",
    glowStyle: "rgba(249, 115, 22, 0.3)",
  },
  {
    icon: Waves,
    title: "Spectral Visualization",
    description: "See your sound in stunning detail",
    image: "/sound-wave-visualization-purple-cyan-abstract.jpg",
    gradientStyle: "linear-gradient(135deg, #06b6d4, #14b8a6, #10b981)",
    glowStyle: "rgba(6, 182, 212, 0.3)",
  },
  {
    icon: BarChart3,
    title: "Mix Analysis",
    description: "Real-time spectral analysis of your audio mix",
    image: "/audio-spectrum-analyzer-purple-neon-visualization.jpg",
    gradientStyle: "linear-gradient(135deg, #7c3aed, #8b5cf6, #6366f1)",
    glowStyle: "rgba(139, 92, 246, 0.3)",
  },
  {
    icon: Zap,
    title: "AI Feedback",
    description: "Get intelligent suggestions to improve your mix",
    image: "/futuristic-audio-interface-purple-holographic-ui.jpg",
    gradientStyle: "linear-gradient(135deg, #d946ef, #ec4899, #f43f5e)",
    glowStyle: "rgba(236, 72, 153, 0.3)",
  },
]

const plans = [
  {
    id: "free",
    name: "Free Trial",
    price: 0,
    color: "cyan",
    features: ["5 min full access", "All listening modes", "Limited to 3 analyses"],
  },
  {
    id: "economy",
    name: "Economy",
    price: 7.99,
    color: "emerald",
    features: ["30 minutes/month", "Basic frequency analysis", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 25.00,
    popular: true,
    color: "violet",
    features: ["5 hours/month", "Full analysis suite", "Priority support"],
  },
  {
    id: "master",
    name: "Master",
    price: 55.00,
    color: "amber",
    features: ["Unlimited listening", "Advanced diagnostics", "Dedicated support"],
  },
]

export default function ListenBuddyPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro")

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

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Listen Buddy Logo */}
            <div className="inline-flex flex-col items-center mb-10">
              <div className="flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-white">LISTEN</span>
                {/* Listen Buddy Icon */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden">
                  <Image
                    src="/listen-buddy-icon.png"
                    alt="Listen Buddy Icon"
                    fill
                    className="object-cover object-left"
                    priority
                  />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">BUDDY</span>
              </div>
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.3em] mt-1">Audio Analysis Plugin</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Make faster, more confident{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                mix decisions.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Listen Buddy is an AI-powered audio analysis plugin that helps your track translate, hit harder, and get to "done" sooner.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-started?mode=login">
                <Button className="rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-7 text-lg shadow-lg shadow-violet-600/25 transition-all duration-200">
                  <Play className="w-6 h-6 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/5 bg-transparent font-semibold px-10 py-7 text-lg"
              >
                See How It Works
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Cards Section - Moved from homepage */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative flex items-center justify-center h-[400px] sm:h-[480px] lg:h-[550px] perspective-[1500px]">
              {features.map((feature, index) => {
                const Icon = feature.icon

                const transforms = {
                  0: "translateX(-120%) translateZ(-100px) rotateY(25deg) scale(0.85)",
                  1: "translateX(-55%) translateZ(0px) rotateY(8deg) scale(0.95)",
                  2: "translateX(55%) translateZ(0px) rotateY(-8deg) scale(0.95)",
                  3: "translateX(120%) translateZ(-100px) rotateY(-25deg) scale(0.85)",
                }

                const zIndexes = { 0: 1, 1: 3, 2: 3, 3: 1 }
                const blurs = { 0: "blur-[1px]", 1: "", 2: "", 3: "blur-[1px]" }
                const opacities = { 0: "opacity-70", 1: "opacity-100", 2: "opacity-100", 3: "opacity-70" }

                return (
                  <div
                    key={index}
                    className={`absolute w-[280px] sm:w-[320px] lg:w-[380px] xl:w-[420px] transition-all duration-500 ease-out cursor-pointer hover:scale-105 ${blurs[index as keyof typeof blurs]} ${opacities[index as keyof typeof opacities]}`}
                    style={{
                      transform: transforms[index as keyof typeof transforms],
                      zIndex: zIndexes[index as keyof typeof zIndexes],
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-50"
                      style={{ background: feature.glowStyle }}
                    />
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-black/40">
                      <div className="relative h-44 sm:h-52 lg:h-64 xl:h-72 overflow-hidden">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 opacity-40 mix-blend-overlay"
                          style={{ background: feature.gradientStyle }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div
                          className="absolute bottom-3 left-3 w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ background: feature.gradientStyle }}
                        >
                          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 lg:p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-violet-400" />
                          <span className="text-sm uppercase tracking-wider text-violet-400 font-semibold">Pro Feature</span>
                        </div>
                        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">{feature.title}</h4>
                        <p className="text-base lg:text-lg text-white/50 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-base text-emerald-300 font-medium">What You Get</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Free Plugin Assistant —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Yours Forever
                </span>
              </h2>
              <p className="text-lg text-white/50 max-w-xl mx-auto">
                The moment you install Listen Buddy, you get:
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: MessageCircle, title: "Real-time mixing guidance", desc: "Ask questions and get immediate, practical answers." },
                { icon: Settings2, title: "Plugin workflow advice", desc: "Learn how your tools interact effectively." },
                { icon: Library, title: "Complete plugin knowledgebase", desc: "Every plugin you own, searchable and explained." },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-emerald-600/20 flex items-center justify-center mb-5">
                    <item.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-base text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-base">
              {["No subscription required", "No credit card", "Just install and use"].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-white/50">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Audio Analysis Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Content - Bigger Card */}
              <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-3xl p-10 border border-white/10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  <span className="text-base text-violet-300 font-medium">AI Audio Analysis</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  This is where Listen Buddy{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    actually listens.
                  </span>
                </h2>
                <p className="text-lg text-white/60 mb-8">
                  Upload your track and receive:
                </p>

                <div className="space-y-4 mb-8">
                  {["Detailed Mix Analysis", "Stereo field diagnostics", "Dynamic range assessment", "Actionable feedback on what needs attention"].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-violet-400" />
                      </div>
                      <span className="text-lg text-white/70">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-violet-500/10 rounded-xl border border-violet-500/20">
                  <p className="text-lg text-white/70">
                    Try <span className="text-violet-400 font-semibold">5 minutes</span> of listening completely free.
                  </p>
                </div>
              </div>

              {/* Right - Listening Modes */}
              <div>
                <p className="text-base text-white/40 mb-5 font-medium">Listening Modes</p>
                <div className="grid grid-cols-2 gap-4">
                  {listeningModes.map((mode, i) => (
                    <div key={i} className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300">
                      <div className="w-12 h-12 rounded-lg bg-violet-600/20 flex items-center justify-center mb-4">
                        <mode.icon className="w-6 h-6 text-violet-400" />
                      </div>
                      <h4 className="text-lg text-white font-semibold mb-2">{mode.label}</h4>
                      <p className="text-sm text-white/40">{mode.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-16 px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-3xl p-12 border border-white/10 text-center">
              <Link href="/get-started?mode=login">
                <Button className="rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold px-12 py-7 text-lg shadow-lg shadow-violet-600/25 transition-all duration-200 mb-8">
                  <Download className="w-6 h-6 mr-2" />
                  Download Listen Buddy
                </Button>
              </Link>
              <div className="space-y-3">
                {["Free plugin assistant (forever)", "Free audio analysis trial", "Install and start immediately"].map((text, i) => (
                  <div key={i} className="flex items-center justify-center gap-3 text-white/50 text-base">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For Producers Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
              You can{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                feel the problem
              </span>
              —but can't name it yet.
            </h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Listen Buddy turns that instinct into clarity. Insert it, hit Analyze, and get precise feedback you can apply immediately.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { num: "1", label: "Insert", desc: "On any track or master bus" },
                { num: "2", label: "Analyze", desc: "One click to get feedback" },
                { num: "3", label: "Apply", desc: "Actionable moves, immediately" },
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-8 border border-white/10">
                  <div className="text-4xl font-bold text-violet-400 mb-3">{item.num}</div>
                  <h4 className="text-xl font-semibold text-white mb-2">{item.label}</h4>
                  <p className="text-base text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Musical Focus Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Built for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  translation-first listening.
                </span>
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                Balance, clarity, punch, width, and emotional read—not genre templates.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { label: "Balance", icon: BarChart3 },
                { label: "Clarity", icon: Sparkles },
                { label: "Punch", icon: Zap },
                { label: "Width", icon: Waves },
                { label: "Emotion", icon: Music },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 bg-white/[0.04] rounded-full border border-white/10">
                  <item.icon className="w-5 h-5 text-violet-400" />
                  <span className="text-white/70 text-base font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-violet-500/10 rounded-2xl p-8 border border-violet-500/20 text-center">
              <p className="text-lg text-white/70 mb-4">Choose the lens that matches the job:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Mix", "Mastering", "Production", "Podcast", "Film", "Commercial"].map((mode, i) => (
                  <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-base font-medium text-white/70">
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plugin Assistant Chat Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Designed to stay{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  fast and intuitive.
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Buddy Selector */}
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Choose Your Buddy</h3>
                <div className="space-y-4">
                  <div className="p-5 bg-violet-500/10 rounded-xl border border-violet-500/20">
                    <h4 className="font-semibold text-violet-400 text-lg mb-2">Velvet</h4>
                    <p className="text-base text-white/50">Warm, detailed, thoughtful analysis.</p>
                  </div>
                  <div className="p-5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 text-lg mb-2">Verde</h4>
                    <p className="text-base text-white/50">Fast, big-picture, clear direction.</p>
                  </div>
                </div>
              </div>

              {/* Plugin Assistant Chat */}
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Plugin Assistant Chat</h3>
                <p className="text-base text-white/60 mb-6">
                  Move from "what's wrong" to "what do I do with my tools."
                </p>
                <div className="space-y-3">
                  {["Knows what's installed", "Recommends practical moves", "Provides reliable starting points"].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-amber-400" />
                      <span className="text-base text-white/60">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Insights */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
                Real mix moves, not vague advice.
              </h2>
              <p className="text-lg text-white/50">Example feedback from Listen Buddy:</p>
            </div>

            <div className="space-y-5">
              {exampleInsights.map((insight, i) => (
                <div key={i} className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-xl p-6 border border-white/10">
                  <p className="text-base text-white/70 italic leading-relaxed">"{insight}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-6 lg:px-8" id="pricing">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Choose your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  listening level
                </span>
              </h2>
              <p className="text-lg text-white/50">
                The assistant is always free. Upgrade for more listening time.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map((plan) => {
                const colorMap: Record<string, { accent: string; bg: string }> = {
                  cyan: { accent: "text-cyan-400", bg: "bg-cyan-500" },
                  emerald: { accent: "text-emerald-400", bg: "bg-emerald-500" },
                  violet: { accent: "text-violet-400", bg: "bg-violet-500" },
                  amber: { accent: "text-amber-400", bg: "bg-amber-500" },
                }
                const colors = colorMap[plan.color]

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-7 border-2 cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id ? "border-violet-500" : "border-white/10 hover:border-white/20"
                    } ${plan.popular ? "-mt-2 mb-2" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-violet-500 text-white text-sm font-semibold rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className={`text-base font-semibold uppercase tracking-wider mb-4 ${colors.accent}`}>
                        {plan.name}
                      </h3>
                      <div className="text-4xl font-bold text-white">${plan.price.toFixed(2)}<span className="text-base text-white/40">/mo</span></div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Check className={`w-5 h-5 ${colors.accent}`} />
                          <span className="text-sm text-white/60">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={`/get-started?plan=${plan.id}`}>
                      <Button
                        className={`w-full rounded-xl py-6 text-base font-semibold transition-all ${
                          selectedPlan === plan.id
                            ? `${colors.bg} text-white`
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                      >
                        Choose Plan
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Stop second-guessing.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Start finishing.
              </span>
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto">
              Listen Buddy is the "extra set of ears" that fits right into your session—quick, clear, and always on your side.
            </p>
            <Link href="/get-started">
              <Button className="rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold px-12 py-7 text-lg shadow-lg shadow-violet-600/25 transition-all duration-200">
                <Sparkles className="w-6 h-6 mr-2" />
                Start with Listen Buddy
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* About Footer Note */}
        <section className="py-10 px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/40 text-base">
              Listen Buddy is developed by <span className="text-white/60 font-medium">Zenphony</span>.
            </p>
            <p className="text-white/30 text-sm mt-2">
              We build tools for people who care about how music actually sounds.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
