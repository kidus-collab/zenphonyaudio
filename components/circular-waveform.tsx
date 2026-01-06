"use client"

import { useEffect, useState } from "react"

interface CircularWaveformProps {
  className?: string
  size?: number
  bars?: number
}

export function CircularWaveform({
  className = "",
  size = 400,
  bars = 40,
}: CircularWaveformProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const centerSize = size * 0.35
  const barElements = []

  for (let i = 0; i < bars; i++) {
    const angle = (i / bars) * 360
    const delay = i * 0.05
    const randomHeight = 20 + Math.random() * 30

    barElements.push(
      <div
        key={i}
        className="absolute left-1/2 top-1/2 origin-bottom"
        style={{
          width: `${size * 0.015}px`,
          height: `${size * 0.15 + randomHeight}px`,
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
          transformOrigin: "center bottom",
        }}
      >
        <div
          className="w-full rounded-full animate-waveform-bar"
          style={{
            height: "100%",
            background: `linear-gradient(to top, rgba(147, 51, 234, 0.8), rgba(192, 38, 211, 0.9), rgba(34, 211, 238, 1))`,
            animationDelay: `${delay}s`,
            boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)",
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Bars */}
      {barElements}

      {/* Center glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: centerSize,
          height: centerSize,
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(192, 38, 211, 0.2) 50%, transparent 70%)",
          boxShadow: "0 0 60px rgba(147, 51, 234, 0.5), 0 0 100px rgba(192, 38, 211, 0.3)",
        }}
      />

      {/* Outer ring glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          border: "2px solid rgba(147, 51, 234, 0.2)",
          boxShadow: "0 0 30px rgba(147, 51, 234, 0.2), inset 0 0 30px rgba(147, 51, 234, 0.1)",
        }}
      />
    </div>
  )
}
