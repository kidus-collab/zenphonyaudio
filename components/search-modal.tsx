"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowRight, Mic, Wand2, Music, Radio, FileAudio } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const quickLinks = [
  { name: "Listen Buddy Plugin", icon: Music, href: "/products/listen-buddy" },
  { name: "Voice Cloning", icon: Mic, href: "/products/voice-gen" },
  { name: "AI Dubbing", icon: Radio, href: "/products/dub-master" },
  { name: "Sound Effects", icon: FileAudio, href: "/products/sound-forge" },
]

const suggestions = [
  "How to clone my voice",
  "Pricing plans",
  "API documentation",
  "Listen Buddy features",
  "Text to speech demo",
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const filteredSuggestions = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal - Updated to purple glassmorphic theme */}
      <div className="relative z-10 w-full max-w-2xl mx-4 glass-strong rounded-3xl overflow-hidden shadow-2xl glow-violet">
        {/* Search Input */}
        <div className="relative border-b border-border/30">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, docs, help..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-16 pl-16 pr-16 text-lg bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-violet/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Links - Updated colors to violet */}
        <div className="p-6 border-b border-border/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-violet/10 transition-colors group border-glow"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-purple/20 border border-violet/30 flex items-center justify-center">
                  <link.icon className="w-5 h-5 text-violet" />
                </div>
                <span className="font-medium text-foreground group-hover:text-violet transition-colors">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {query ? "Results" : "Popular Searches"}
          </p>
          <div className="space-y-1">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-violet/10 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Wand2 className="w-4 h-4 text-muted-foreground group-hover:text-violet transition-colors" />
                  <span className="text-foreground">{suggestion}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-violet transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-violet/5 flex items-center justify-between text-xs text-muted-foreground border-t border-border/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-violet/10 border border-violet/20">ESC</kbd> to close
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 rounded bg-violet/10 border border-violet/20">Enter</kbd> to search
            </span>
          </div>
          <span className="text-violet">Powered by Zenphony</span>
        </div>
      </div>
    </div>
  )
}
