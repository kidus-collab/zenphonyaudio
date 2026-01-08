"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Activity, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const { signIn, user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show already logged in message if user is authenticated
  if (!authLoading && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Aurora />

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Already Logged In Message */}
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-3xl glass-strong border-glow p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <Activity className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-black text-foreground mb-3">
              You're Already Logged In
            </h1>
            <p className="text-muted-foreground mb-8">
              You're currently signed in as <span className="text-violet font-medium">{user.email}</span>
            </p>

            <div className="space-y-3">
              <button
                onClick={async () => {
                  await signOut()
                  router.push("/")
                }}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0"
              >
                Sign Out
              </button>
              <Link
                href="/"
                className="block w-full h-14 rounded-2xl bg-white/[0.05] border border-white/10 text-foreground/70 hover:text-foreground hover:bg-white/10 font-semibold text-base transition-all duration-200 flex items-center justify-center"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs before submitting
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }
    
    setError(null)
    setLoading(true)

    console.log('[Login] Attempting sign in with:', { email })
    
    try {
      const { error } = await signIn(email, password)
      console.log('[Login] Sign in result:', { error })
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password")
        } else {
          setError(error.message)
        }
      }
    } catch (err) {
      console.error('[Login] Error during sign in:', err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Aurora />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <ZenphonyLogo className="h-10 w-auto" variant="light" />
        </div>

        {/* Form Card - Glassmorphic with split layout */}
        <div className="rounded-3xl glass-strong border-glow overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Single Image (50%) */}
          <div className="w-full md:w-1/2 relative bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-background min-h-[400px] overflow-hidden">
            <Image
              src="/person-wearing-futuristic-headphones-purple-neon-l.jpg"
              alt="Creator"
              fill
              className="object-cover opacity-60"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />

            {/* Quote overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-xl font-bold text-white leading-tight">Welcome back, creator</p>
                <p className="text-white/60 font-medium">Zenphony Audio</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form (50%) */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-black text-foreground mb-2">Welcome back, creator</h1>
            <p className="text-muted-foreground mb-6">Sign in to your account to continue</p>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  placeholder="Email address"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  placeholder="Password"
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-violet hover:text-violet/80 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              variant="outline"
              className="border-border/30 text-foreground hover:bg-violet/10 hover:border-violet/30 bg-transparent rounded-full w-full"
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

            {/* Sign Up Link */}
            <p className="text-center text-white/50 mt-8">
              Don't have an account?{" "}
              <Link href="/signup" className="text-violet hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
