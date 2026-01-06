"use client"

import { useEffect, useRef } from "react"

interface ColorBendsProps {
  className?: string
  colors?: string[]
  speed?: number
  blur?: number
  position?: "full" | "bottom" | "section"
}

export function ColorBends({
  className = "",
  colors = ["#8b5cf6", "#a855f7", "#d946ef", "#06b6d4", "#8b5cf6"],
  speed = 0.02,
  blur = 150,
  position = "full",
}: ColorBendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      time += speed

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create flowing gradient blobs
      const blobs = [
        { x: 0.2 + Math.sin(time * 0.5) * 0.1, y: 0.3 + Math.cos(time * 0.3) * 0.1, color: colors[0] },
        { x: 0.8 + Math.cos(time * 0.4) * 0.1, y: 0.2 + Math.sin(time * 0.6) * 0.1, color: colors[1] },
        { x: 0.5 + Math.sin(time * 0.3) * 0.15, y: 0.7 + Math.cos(time * 0.5) * 0.1, color: colors[2] },
        { x: 0.3 + Math.cos(time * 0.6) * 0.1, y: 0.8 + Math.sin(time * 0.4) * 0.1, color: colors[3] },
        { x: 0.7 + Math.sin(time * 0.5) * 0.1, y: 0.5 + Math.cos(time * 0.7) * 0.15, color: colors[4] || colors[0] },
      ]

      blobs.forEach((blob) => {
        const gradient = ctx.createRadialGradient(
          blob.x * canvas.width,
          blob.y * canvas.height,
          0,
          blob.x * canvas.width,
          blob.y * canvas.height,
          canvas.width * 0.4
        )

        gradient.addColorStop(0, blob.color + "40")
        gradient.addColorStop(0.5, blob.color + "20")
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [colors, speed])

  const positionClasses = position === "bottom"
    ? "absolute bottom-0 left-0 right-0 h-[60vh]"
    : position === "section"
    ? "absolute inset-0"
    : "fixed inset-0"

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${positionClasses} ${className}`}
      style={{ filter: `blur(${blur}px)` }}
    />
  )
}
