import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Headphones, Mic, Radio, Music, Play, Download, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

const products = {
  "listen-buddy": {
    name: "Listen Buddy",
    tagline: "AI Audio Plugin",
    category: "Audio Analysis",
    description: "Engineered by Zenphony DSP Lab",
    longDescription:
      "Your track gets analyzed with AI-powered spectral intelligence. Listen Buddy provides real-time mix analysis, spectral energy monitoring, and professional-grade feedback to help you achieve commercial-ready mixes.",
    icon: Headphones,
    image: "/listen-buddy-interface-dark-purple-ui.jpg",
    price: "$19",
    features: [
      "Real-time Mix Analysis",
      "Spectral Energy Monitoring",
      "LUFS & RMS Metering",
      "AI-Powered Feedback",
      "Reference Track Comparison",
      "Stereo Field Optimization",
      "Low-End Analysis",
      "Transient Detection",
    ],
    specs: [
      { label: "Latency", value: "< 5ms" },
      { label: "Sample Rates", value: "Up to 192kHz" },
      { label: "Formats", value: "VST3, AU, AAX" },
      { label: "OS", value: "Win & Mac" },
    ],
  },
  "voice-gen": {
    name: "VoiceGen",
    tagline: "Voice Synthesis",
    category: "AI Voice",
    description: "Neural Voice Generation",
    longDescription:
      "Create lifelike speech with our AI audio platform. VoiceGen offers human-like speech in 32 languages, perfect for audiobooks, voiceovers, and content creation.",
    icon: Mic,
    image: "/voice-synthesis-waveform-purple-neon.jpg",
    price: "$29",
    features: [
      "500+ Voice Models",
      "32 Languages",
      "Emotion Control",
      "Voice Cloning",
      "Real-time Generation",
      "SSML Support",
      "Batch Processing",
      "Commercial License",
    ],
    specs: [
      { label: "Quality", value: "HD 48kHz" },
      { label: "Languages", value: "32+" },
      { label: "Voices", value: "500+" },
      { label: "API", value: "RESTful" },
    ],
  },
  "dub-master": {
    name: "DubMaster",
    tagline: "Dubbing Studio",
    category: "Video Dubbing",
    description: "AI-Powered Dubbing",
    longDescription:
      "Translate and dub videos with perfect lip-sync and emotion preservation. DubMaster uses advanced AI to maintain the original speaker's tone and timing.",
    icon: Radio,
    image: "/dubbing-studio-interface-dark-purple.jpg",
    price: "$49",
    features: [
      "Perfect Lip-Sync",
      "Emotion Preservation",
      "Multi-Speaker Detection",
      "Background Audio Separation",
      "Subtitle Generation",
      "Batch Processing",
      "API Access",
      "Team Collaboration",
    ],
    specs: [
      { label: "Resolution", value: "Up to 4K" },
      { label: "Languages", value: "50+" },
      { label: "Accuracy", value: "98%" },
      { label: "Export", value: "MP4, MOV" },
    ],
  },
  "sound-forge": {
    name: "SoundForge",
    tagline: "Sound Effects",
    category: "Audio Generation",
    description: "Text-to-Sound AI",
    longDescription:
      "Generate unique sound effects and ambient soundscapes from text descriptions. SoundForge creates custom audio that perfectly matches your creative vision.",
    icon: Music,
    image: "/sound-effects-generator-purple-ui.jpg",
    price: "$39",
    features: [
      "Text-to-Sound Generation",
      "Ambient Soundscapes",
      "Foley Effects",
      "Style Control",
      "Variation Generator",
      "HD Quality Output",
      "Commercial License",
      "Sound Library",
    ],
    specs: [
      { label: "Quality", value: "HD 96kHz" },
      { label: "Formats", value: "WAV, MP3, FLAC" },
      { label: "Library", value: "10K+ Sounds" },
      { label: "Generation", value: "< 10s" },
    ],
  },
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = products[id as keyof typeof products]

  if (!product) {
    notFound()
  }

  const Icon = product.icon

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ColorBends />
      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                  <Icon className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-white/80">{product.category}</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight">
                  {product.name.toUpperCase()}
                </h1>
                <p className="text-violet-400 font-medium mb-4">{product.description}</p>
                <p className="text-xl text-white/60 mb-8 leading-relaxed max-w-lg">{product.longDescription}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-white">{product.price}</span>
                  <span className="text-white/60">/month</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <Link href="/signup">
                    <Button className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-8 py-6 text-lg">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent font-semibold px-8 py-6"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white/60">4.9/5 from 500+ reviews</span>
                </div>
              </div>

              {/* Right - Product Image */}
              <div className="relative">
                <div className="glass rounded-3xl overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={700}
                    height={500}
                    className="w-full object-cover"
                  />
                </div>

                {/* Floating Specs Card */}
                <div className="absolute -bottom-8 -left-8 glass rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {product.specs.map((spec, i) => (
                      <div key={i}>
                        <p className="text-white/40 text-xs mb-1">{spec.label}</p>
                        <p className="text-white font-bold">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-12">FEATURES</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.features.map((feature, i) => (
                <div key={i} className="glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to transform your audio?</h2>
                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                  Start your 14-day free trial today. No credit card required.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <Button className="rounded-full bg-white text-violet-600 hover:bg-white/90 font-bold px-8 py-6 text-lg">
                      <Download className="w-5 h-5 mr-2" />
                      Download Now
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      className="rounded-full border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold px-8 py-6"
                    >
                      View All Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
