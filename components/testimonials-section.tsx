"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { TiltCard } from "./tilt-card"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Music Producer",
    avatar: "/avatar-1.jpg",
    content: "Listen Buddy has completely transformed my workflow. The AI mix analysis saves me hours of work.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Podcast Host",
    avatar: "/avatar-2.jpg",
    content: "The voice cloning feature is incredible. My listeners can't tell the difference from my real voice.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Sound Designer",
    avatar: "/avatar-3.jpg",
    content: "SoundForge generates exactly what I need. It's like having an infinite sound library.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative py-24 px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-magenta/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tight">
            Our happy <span className="text-gradient-violet">Customers</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TiltCard key={index} tiltMax={10} scale={1.03}>
              <div className="glass rounded-3xl p-8 card-3d h-full">
                {/* Avatar and Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-violet to-magenta p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-coral text-coral drop-shadow-sm" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/80 leading-relaxed">{testimonial.content}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
