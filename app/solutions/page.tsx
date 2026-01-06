import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Check, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const solutions = [
  {
    title: "For Music Producers",
    description: "Elevate your mixes with AI-powered analysis, mastering tools, and spectral visualization.",
    features: [
      "Real-time mix analysis",
      "AI mastering assistant",
      "Spectral energy monitoring",
      "Reference track comparison",
    ],
    cta: "Explore Producer Tools",
    href: "/products/listen-buddy",
  },
  {
    title: "For Content Creators",
    description: "Generate voiceovers, dub videos, and create unique sound effects without recording.",
    features: ["500+ AI voice models", "Multi-language dubbing", "Custom voice cloning", "Sound effect generation"],
    cta: "Explore Creator Tools",
    href: "/products/voice-gen",
  },
  {
    title: "For Enterprises",
    description: "Scale your audio production with API access, team collaboration, and custom integrations.",
    features: ["RESTful API access", "Team workspaces", "Custom model training", "Priority support"],
    cta: "Contact Sales",
    href: "/contact",
  },
]

const useCases = [
  { title: "Podcasting", icon: "🎙️" },
  { title: "Audiobooks", icon: "📚" },
  { title: "Video Production", icon: "🎬" },
  { title: "Music Production", icon: "🎵" },
  { title: "Game Development", icon: "🎮" },
  { title: "E-Learning", icon: "📖" },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ColorBends />
      <div className="relative z-10">
        <Navigation />

        {/* Hero */}
        <section className="pt-40 pb-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-white/80">Tailored for your workflow</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Solutions for <span className="text-gradient-violet">Every Creator</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Whether you're a solo producer or an enterprise team, we have the tools to transform your audio workflow.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <div key={index} className="glass rounded-3xl p-8 hover:bg-white/[0.08] transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                  <p className="text-white/60 mb-6">{solution.description}</p>

                  <ul className="space-y-3 mb-8">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/80">
                        <Check className="w-5 h-5 text-violet-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={solution.href}>
                    <Button className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold">
                      {solution.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-16">
              Use <span className="text-gradient-violet">Cases</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {useCases.map((useCase, index) => (
                <div key={index} className="glass rounded-2xl p-6 text-center hover:bg-white/[0.08] transition-all">
                  <span className="text-4xl mb-3 block">{useCase.icon}</span>
                  <span className="text-white/80 font-medium">{useCase.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
