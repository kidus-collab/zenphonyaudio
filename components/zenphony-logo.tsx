export function ZenphonyLogo({
  className = "",
  variant = "light",
}: { className?: string; variant?: "light" | "dark" }) {
  const textColor = variant === "light" ? "#e8e4f0" : "#0d0b14"
  const accentColor = "#a78bfa" // Violet accent

  return (
    <svg viewBox="0 0 220 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sound wave icon in circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
      <path
        d="M12 20h3M17 14v12M22 16v8M27 13v14"
        stroke={variant === "light" ? "#0d0b14" : "#ffffff"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ZenphonyAudio text */}
      <text x="46" y="24" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="16" fill={textColor}>
        Zenphony<tspan fill={accentColor}>Audio</tspan>
      </text>
    </svg>
  )
}
