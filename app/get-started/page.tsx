"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Activity, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { ColorBends } from "@/components/color-bends"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"

const signupImages = [
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
    quote: "Start your audio journey today",
    author: "Zenphony Audio",
  },
]

const loginImages = [
  {
    src: "/sound-wave-visualization-purple-cyan-abstract.jpg",
    quote: "Welcome back, creator",
    author: "Continue where you left off",
  },
  {
    src: "/audio-mixing-console-purple-neon-lights-studio.jpg",
    quote: "Your projects await",
    author: "Pick up right where you stopped",
  },
  {
    src: "/professional-microphone-purple-lighting-studio.jpg",
    quote: "Ready to create again?",
    author: "Your workspace is ready",
  },
  {
    src: "/music-producer-at-computer-purple-ambient-light.jpg",
    quote: "Great to see you again",
    author: "Let's make something amazing",
  },
]

function GetStartedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, signIn, signUp, signInWithGoogle } = useAuth()

  // Initialize isLogin based on URL param immediately
  const initialMode = searchParams.get("mode") === "login"
  const [isLogin, setIsLogin] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [currentImage, setCurrentImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const plan = searchParams.get("plan")
      if (plan) {
        router.push(`/products/listen-buddy#pricing`)
      } else {
        router.push("/")
      }
    }
  }, [user, router, searchParams])

  // Update mode when URL changes
  useEffect(() => {
    const mode = searchParams.get("mode")
    setIsLogin(mode === "login")
  }, [searchParams])

  const carouselImages = isLogin ? loginImages : signupImages

  useEffect(() => {
    setCurrentImage(0) // Reset to first image when switching modes
  }, [isLogin])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setError("Invalid email or password")
          } else {
            setError(error.message)
          }
        }
      } else {
        const { error } = await signUp(email, password, name)
        if (error) {
          if (error.message.includes("User already registered") || error.message.includes("already been registered")) {
            setError("An account with this email already exists. Please sign in instead.")
          } else if (error.message.includes("Password should be")) {
            setError("Password must be at least 6 characters")
          } else {
            setError(error.message)
          }
        } else {
          setSuccessMessage("Check your email for the confirmation link!")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* ColorBends Animated Background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      {/* Additional gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-fuchsia-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Centered Modal */}
      <div className="relative z-10 w-full max-w-5xl mx-4">
        {/* Glow effect behind modal */}
        <div className="absolute -inset-4 bg-violet-500/20 rounded-[2.5rem] blur-2xl" />

        {/* Modal Card */}
        <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden flex">

          {/* Left side - Image carousel (hidden on mobile) */}
          <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-background min-h-[600px]">
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-white leading-tight">{carouselImages[currentImage].quote}</p>
                <p className="text-white/60 font-medium">{carouselImages[currentImage].author}</p>
              </div>

              {/* Carousel indicators */}
              <div className="flex gap-2 mt-6">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? "w-8 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        : "w-1.5 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative logo */}
            <div className="absolute top-8 left-8">
              <ZenphonyLogo className="h-8 w-auto" variant="light" />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
            {/* Mobile Logo */}
            <div className="flex justify-center mb-8 md:hidden">
              <ZenphonyLogo className="h-10 w-auto" variant="light" />
            </div>

            {/* Header */}
            <div className="text-center md:text-left mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h1>
              <p className="text-white/50 text-sm">
                {isLogin
                  ? "Sign in to continue to Zenphony"
                  : "Create your account to start creating"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-white placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/40 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Continue with Google</span>
            </button>

            {/* Toggle Login/Signup */}
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null)
                    setSuccessMessage(null)
                  }}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-white/30 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

// Wrapper with Suspense for useSearchParams
export default function GetStartedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    }>
      <GetStartedContent />
    </Suspense>
  )
}
