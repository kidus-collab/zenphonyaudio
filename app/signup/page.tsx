"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Activity, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"

const signupImages = [
  {
    src: "/person-with-headphones-purple-neon-lighting-studio.jpg",
    quote: "Transform your audio with AI",
    author: "Zenphony Audio",
  },
  {
    src: "/professional-microphone-purple-lighting-studio.jpg",
    quote: "Create professional audio content",
    author: "Zenphony Audio",
  },
  {
    src: "/music-producer-at-mixing-console-orange-led-lights.jpg",
    quote: "Mix like a pro",
    author: "Zenphony Audio",
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentImage, setCurrentImage] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % signupImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [signupImages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (password !== confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      console.log('[Signup] Attempting to sign up with:', { email, name })
      
      const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/auth/callback`
      console.log('[Signup] Using redirect URL:', redirectUrl)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          },
        },
      })

      console.log('[Signup] Sign up result:', { data, error })

      if (error) {
        console.error('[Signup] Sign up error:', error)
        
        // Check if email is already registered
        if (error.message.includes("already been registered") ||
            error.message.includes("already registered") ||
            error.message.includes("User already registered")) {
          setError("Email is already registered. Please sign in instead.")
        } else if (error.message.includes("Email rate limit") || error.message.includes("rate limit")) {
          setError("Too many sign-up attempts. Please wait a few minutes and try again.")
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please check your email for a confirmation link to activate your account.")
        } else {
          setError(error.message || "An error occurred during sign up. Please try again.")
        }
        return
      }

      console.log('[Signup] Sign up successful, redirecting to success page')
      // Success - redirect to check email page
      router.push("/signup/success")
    } catch (err) {
      console.error('[Signup] Unexpected error:', err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      <Aurora />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <ZenphonyLogo className="h-10 w-auto" variant="light" />
        </div>

        {/* Form Card - Glassmorphic with split layout */}
        <div className="rounded-3xl glass-strong border-glow overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Image Carousel (50%) */}
          <div className="w-full md:w-1/2 relative bg-gradient-to-br from-fuchsia-900/50 via-purple-900/30 to-background min-h-[400px] overflow-hidden">
            {/* Images */}
            {signupImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.author}
                  fill
                  className="object-cover opacity-60"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
              </div>
            ))}

            {/* Quote overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-[0_0_30px_rgba(192,38,211,0.5)]">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-xl font-bold text-white leading-tight">{signupImages[currentImage].quote}</p>
                <p className="text-white/60 font-medium">{signupImages[currentImage].author}</p>
              </div>

              {/* Carousel indicators */}
              <div className="flex gap-2 mt-6">
                {signupImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? "w-8 bg-gradient-to-r from-fuchsia-500 to-pink-500"
                        : "w-1.5 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form (50%) */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-black text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground mb-6">Join Zenphony Audio to create with AI</p>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                  placeholder="Full Name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                  placeholder="Email address"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 pr-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                    placeholder="Password"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 pr-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                  placeholder="Confirm Password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded border-white/10 bg-white/[0.05] text-fuchsia focus:ring-2 focus:ring-fuchsia/50 mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-white/50">
                  I agree to{" "}
                  <Link href="#" className="text-fuchsia hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-fuchsia hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold shadow-[0_8px_32px_rgba(192,38,211,0.4)] hover:shadow-[0_8px_40px_rgba(192,38,211,0.6)] transition-all duration-300 border-0 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <Button
              variant="outline"
              className="border-border/30 text-foreground hover:bg-fuchsia/10 hover:border-fuchsia/30 bg-transparent rounded-full w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            {/* Login Link */}
            <p className="text-center text-white/50 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-fuchsia hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
