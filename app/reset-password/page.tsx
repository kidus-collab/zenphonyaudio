"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if there's a valid recovery session
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      // User should have a session from clicking the reset link
      if (session) {
        setIsValidSession(true)
      } else {
        setIsValidSession(false)
      }
    }

    checkSession()

    // Listen for auth state changes (when user clicks reset link)
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsValidSession(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      console.error('Error resetting password:', err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Aurora />

        <div className="relative z-10 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <ZenphonyLogo className="h-10 w-auto" variant="light" />
          </div>

          <div className="rounded-3xl glass-strong border-glow p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-3">
              Password reset successful!
            </h1>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>

            <p className="text-sm text-white/50 mb-6">
              Redirecting to sign in...
            </p>

            <Link href="/login">
              <Button
                className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold"
              >
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Invalid session state
  if (isValidSession === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Aurora />

        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="relative z-10 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <ZenphonyLogo className="h-10 w-auto" variant="light" />
          </div>

          <div className="rounded-3xl glass-strong border-glow p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <Lock className="w-12 h-12 text-red-400" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-3">
              Invalid or expired link
            </h1>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <div className="space-y-3">
              <Link href="/forgot-password">
                <Button
                  className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold"
                >
                  Request new link
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-border/30 text-foreground hover:bg-violet/10 hover:border-violet/30 bg-transparent"
                >
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Aurora />
        <div className="relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-violet" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Aurora />

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-violet transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <ZenphonyLogo className="h-10 w-auto" variant="light" />
        </div>

        <div className="rounded-3xl glass-strong border-glow p-8">
          <h1 className="text-3xl font-black text-foreground mb-2 text-center">
            Set new password
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            Your new password must be at least 8 characters.
          </p>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                  placeholder="New password"
                  required
                  minLength={8}
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
              <p className="text-xs text-white/40 mt-2 ml-1">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Reset password"
              )}
            </Button>
          </form>

          <p className="text-center text-white/50 mt-8">
            Remember your password?{" "}
            <Link href="/login" className="text-violet hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
