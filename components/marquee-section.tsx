"use client"

import { Plus } from "lucide-react"

const marqueeItems = [
  "Voice Synthesis",
  "Mix Analysis",
  "AI Mastering",
  "Audio Design",
  "Plugin Suite",
  "Sound Effects",
  "Voice Cloning",
  "Audio Enhancement",
]

export function MarqueeSection() {
  return (
    <section className="relative py-12 overflow-hidden">
      <div
        className="py-4 bg-white/5 backdrop-blur-2xl"
        style={{
          transform: "rotate(-3deg) scale(1.1)",
          transformOrigin: "center center",
        }}
      >
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="flex items-center gap-8">
              <span className="text-lg font-semibold text-foreground/80 hover:text-foreground transition-colors cursor-default">
                {item}
              </span>
              <Plus className="w-5 h-5 text-coral" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
