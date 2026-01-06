"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { Headphones, Mic, Radio, Music, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const featuredProduct = {
  id: "listen-buddy",
  name: "Listen Buddy",
  tagline: "AI Audio Plugin",
  description:
    "Engineered by Zenphony DSP Lab. Your track gets analyzed with AI-powered spectral intelligence for professional-grade mix feedback.",
  image: "/listen-buddy-interface-dark-purple-ui.jpg",
}

const products = [
  {
    id: "listen-buddy",
    name: "Listen Buddy",
    category: "Audio Plugin",
    description: "AI-powered mix analysis and audio optimization plugin for professional producers.",
    icon: Headphones,
    image: "/listen-buddy-plugin-interface-purple.jpg",
    price: "$19",
    popular: true,
  },
  {
    id: "voice-gen",
    name: "VoiceGen",
    category: "Voice Synthesis",
    description: "Create lifelike voiceovers using advanced neural voice models in 32+ languages.",
    icon: Mic,
    image: "/voice-synthesis-waveform-purple-neon.jpg",
    price: "$29",
    popular: false,
  },
  {
    id: "dub-master",
    name: "DubMaster",
    category: "Dubbing Studio",
    description: "Translate and dub videos with perfect lip-sync and emotion preservation.",
    icon: Radio,
    image: "/dubbing-studio-interface-dark-purple.jpg",
    price: "$49",
    popular: false,
  },
  {
    id: "sound-forge",
    name: "SoundForge",
    category: "Sound Effects",
    description: "Generate unique sound effects and ambient soundscapes from text descriptions.",
    icon: Music,
    image: "/sound-effects-generator-purple-ui.jpg",
    price: "$39",
    popular: false,
  },
]

export default function ProductsPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ColorBends />
      <div className="relative z-10">
        <Navigation />

        {/* Hero Section - SpaceShirt Style */}
        <section className="pt-40 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-white/40 text-sm">EST 2024</span>
                  <div className="w-12 h-px bg-white/20" />
                </div>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight mb-2">ZENPHONY</h1>
                <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gradient-violet tracking-tight mb-6">
                  PRODUCTS
                </h2>
                <p className="text-white/60 max-w-md mb-8 leading-relaxed">
                  Professional audio tools created by highly skilled engineers. Excellence in each of our products.
                </p>
                <div className="flex gap-4">
                  <Link href="#products">
                    <Button className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8">
                      BROWSE ALL
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent font-semibold px-8"
                    >
                      PRICING
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right - Featured Product Card */}
              <div className="relative">
                <div className="glass rounded-3xl p-6 relative">
                  <div className="absolute -top-3 right-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs font-bold text-white">
                    <Sparkles className="w-3 h-3" />
                    FEATURED
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 mb-4">
                    <Image
                      src={featuredProduct.image || "/placeholder.svg"}
                      alt={featuredProduct.name}
                      width={600}
                      height={340}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-violet-400 text-sm font-medium mb-1">{featuredProduct.tagline}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{featuredProduct.name}</h3>
                  <p className="text-white/60 text-sm">{featuredProduct.description}</p>
                </div>

                {/* Decorative Star Rating */}
                <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-white text-xs font-medium">500+ 5-STAR REVIEWS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Carousel - Moon Design Style */}
        <section className="py-20 px-6 lg:px-8 relative" id="products">
          <div className="max-w-7xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white font-bold text-lg">AUDIO</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-white">Our Products</h2>

              <div className="flex items-center gap-4">
                <span className="text-white font-bold text-lg">TOOLS</span>
                <button
                  onClick={() => setActiveIndex(Math.min(products.length - 1, activeIndex + 1))}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const Icon = product.icon
                const isActive = index === activeIndex
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className={`group relative transition-all duration-500 ${isActive ? "scale-105 z-10" : "scale-100"}`}
                  >
                    <div
                      className={`glass rounded-3xl p-4 transition-all duration-300 ${isActive ? "bg-white/10 ring-2 ring-violet-500/50" : "hover:bg-white/[0.08]"}`}
                    >
                      {product.popular && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center z-10">
                          <Headphones className="w-5 h-5 text-white" />
                        </div>
                      )}

                      <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 mb-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div
                        className={`text-center py-2 rounded-xl transition-all ${isActive ? "bg-white text-black" : "bg-white/5 text-white"}`}
                      >
                        <span className="font-bold text-sm">{product.name.toUpperCase()}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* See All Button */}
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent font-semibold px-8"
              >
                SEE ALL PRODUCTS
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Newest Products - Scattered Layout */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-16">
              OUR NEWEST
              <br />
              <span className="text-gradient-violet">PRODUCTS</span>
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product, index) => {
                const Icon = product.icon
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className={`group relative ${index === 1 ? "lg:translate-y-12" : ""}`}
                  >
                    <div className="glass rounded-3xl overflow-hidden hover:bg-white/[0.08] transition-all">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-white text-black text-xs font-bold mb-2">
                          {product.category.toUpperCase()}
                        </span>
                        <p className="text-white/60 text-sm">{product.price}/mo</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-violet-400 font-medium mb-4">ZENPHONY AUDIO</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              GET YOUR
              <br />
              FAVORITE TOOLS
              <br />
              AND CREATE
              <br />
              <span className="text-gradient-violet">WITH US</span>
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-8">
              Professional audio tools created by highly skilled engineers. Excellence in each of our products.
            </p>
            <Button className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-10 py-6 text-lg">
              START CREATING
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
