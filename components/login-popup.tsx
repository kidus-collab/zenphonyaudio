"use client"

import { useState, useEffect } from "react"
import { X, Mail, User, MessageSquare, Send, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import Image from "next/image"

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

const carouselImages = [
  {
    src: "/audio-mixing-console-purple-neon-lights-studio.jpg",
    quote: "Create stunning audio with AI",
    author: "Voice Generation",
  },
  {
    src: "/sound-wave-visualization-purple-cyan-abstract.jpg",
    quote: "Transform your voice instantly",
    author: "Real-time Processing",
  },
  {
    src: "/professional-microphone-purple-lighting-studio.jpg",
    quote: "Studio quality, anywhere",
    author: "Listen Buddy Plugin",
  },
  {
    src: "/music-producer-at-computer-purple-ambient-light.jpg",
    quote: "Join 50,000+ creators",
    author: "Zenphony Community",
  },
]

export function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl glass-strong rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left side - Image carousel (50%) */}
        <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-violet via-purple to-background">
          {/* Images */}
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image src={img.src || "/placeholder.svg"} alt={img.author} fill className="object-cover opacity-60" />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
            </div>
          ))}

          {/* Quote overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet to-purple flex items-center justify-center glow-violet">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground leading-tight">{carouselImages[currentImage].quote}</p>
              <p className="text-muted-foreground font-medium">{carouselImages[currentImage].author}</p>
            </div>

            {/* Carousel indicators */}
            <div className="flex gap-2 mt-6">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImage
                      ? "w-8 bg-gradient-to-r from-violet to-purple"
                      : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 left-8">
            <ZenphonyLogo className="h-8 w-auto" variant="light" />
          </div>
        </div>

        {/* Right side - Contact form (50%) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-violet/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <ZenphonyLogo className="h-10 w-auto" variant="light" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-foreground mb-3">Get In Touch</h2>
            <p className="text-muted-foreground">Have questions about our audio tools? We'd love to hear from you.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-secondary/50 border-border/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet focus-visible:border-violet"
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-secondary/50 border-border/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet focus-visible:border-violet"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-secondary/50 border-border/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-violet focus-visible:border-violet"
              />
            </div>

            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-14 pl-4 pr-4 rounded-2xl bg-secondary/50 border border-border/30 text-foreground focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales & Pricing</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <textarea
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet focus:border-violet resize-none"
              />
            </div>

            <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet to-purple text-white hover:opacity-90 font-bold text-lg group glow-violet">
              Send Message
              <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Contact options */}
          <div className="mt-8 pt-6 border-t border-border/20">
            <div className="flex items-center justify-center gap-6">
              <a href="mailto:hello@zenphony.com" className="flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@zenphony.com</span>
              </a>
              <span className="text-border">|</span>
              <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Live Chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
