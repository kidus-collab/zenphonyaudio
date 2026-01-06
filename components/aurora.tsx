"use client"

export function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main aurora blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full animate-aurora"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.55 0.25 280 / 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[10%] right-[-20%] w-[50%] h-[50%] rounded-full animate-aurora"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.7 0.2 320 / 0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "-5s",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full animate-aurora"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.75 0.15 200 / 0.2) 0%, transparent 70%)",
          filter: "blur(70px)",
          animationDelay: "-10s",
        }}
      />
      <div
        className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] rounded-full animate-aurora"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.65 0.25 280 / 0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
          animationDelay: "-7s",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.95 0.01 280 / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.95 0.01 280 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
