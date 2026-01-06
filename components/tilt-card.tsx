"use client"

import { useRef, useState, ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
  glareEnabled?: boolean
  tiltMax?: number
  perspective?: number
  scale?: number
}

export function TiltCard({
  children,
  className = "",
  glareEnabled = true,
  tiltMax = 15,
  perspective = 1000,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")
  const [glareStyle, setGlareStyle] = useState({})

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltMax
    const rotateY = ((x - centerX) / centerX) * tiltMax

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    )

    if (glareEnabled) {
      const glareX = (x / rect.width) * 100
      const glareY = (y / rect.height) * 100
      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
      })
    }
  }

  const handleMouseLeave = () => {
    setTransform("")
    setGlareStyle({})
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: transform ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {glareEnabled && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={glareStyle}
        />
      )}
    </div>
  )
}
