"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    setShowContent(false)

    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowContent(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {/* Loading Skeleton Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-background">
          {/* Animated gradient background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "-1s" }} />
          </div>

          {/* Skeleton content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
            {/* Nav skeleton */}
            <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[700px] h-14 rounded-full bg-white/5 animate-pulse" />

            {/* Hero skeleton */}
            <div className="flex flex-col items-center gap-6 mt-20">
              <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
              <div className="h-16 w-96 rounded-2xl bg-white/5 animate-pulse" style={{ animationDelay: "-0.2s" }} />
              <div className="h-16 w-80 rounded-2xl bg-white/5 animate-pulse" style={{ animationDelay: "-0.4s" }} />
              <div className="h-6 w-64 rounded-full bg-white/5 animate-pulse mt-4" style={{ animationDelay: "-0.6s" }} />
            </div>

            {/* Cards skeleton */}
            <div className="grid grid-cols-3 gap-6 mt-24">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-white/5 animate-pulse"
                  style={{ animationDelay: `${-i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {/* Center loading indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-gradient-to-t from-violet-500 to-fuchsia-400 rounded-full animate-waveform-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <div
        className={`transition-all duration-500 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {children}
      </div>
    </>
  )
}
