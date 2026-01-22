"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Loader2, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null)

  // Countdown timer for rate limit
  useEffect(() => {
    if (rateLimitCountdown === null || rateLimitCountdown <= 0) return

    const timer = setInterval(() => {
      setRateLimitCountdown((prev) => {
        if (prev === null || prev <= 1) {
          setError(null)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [rateLimitCountdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      // Redirect directly to reset-password - it will handle the code exchange
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      const redirectUrl = `${baseUrl}/reset-password`

      console.log('[ForgotPassword] Sending reset email with redirect:', redirectUrl)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        console.log('[ForgotPassword] Error:', error.message, error)

        // Check for rate limit error
        const errorMsg = error.message?.toLowerCase() || ''
        const isRateLimit = errorMsg.includes('rate limit') ||
                           errorMsg.includes('rate_limit') ||
                           errorMsg.includes('too many') ||
                           errorMsg.includes('exceeded') ||
                           error.status === 429

        if (isRateLimit) {
          setError("Email rate limit exceeded. Please wait before trying again.")
          setRateLimitCountdown(60) // Supabase default: 60 seconds between emails
        } else {
          setError(error.message)
        }
      } else {
        setSuccess(true)
      }
    } catch (err) {
      console.error('Error sending reset email:', err)
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
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-3">
              Check your email
            </h1>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              We've sent a password reset link to <span className="text-violet font-medium">{email}</span>.
              Click the link in the email to reset your password.
            </p>

            <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-foreground font-medium mb-1">
                    Didn't receive the email?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Check your <span className="text-violet-400">Spam folder</span> or <span className="text-violet-400">All Mail</span>, or try again with a different email.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/login">
                <Button
                  className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold"
                >
                  Back to Sign In
                </Button>
              </Link>

              <button
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
                className="w-full text-sm text-violet hover:underline"
              >
                Try a different email
              </button>
            </div>
          </div>
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
            Forgot password?
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            No worries, we'll send you reset instructions.
          </p>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">
              <div className="flex items-start gap-3">
                {rateLimitCountdown !== null && (
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p>{error}</p>
                  {rateLimitCountdown !== null && (
                    <p className="mt-2 text-amber-400 font-medium">
                      Try again in {rateLimitCountdown} second{rateLimitCountdown !== 1 ? 's' : ''}
                    </p>
                  )}
                  {rateLimitCountdown !== null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supabase allows 4 password reset emails per hour.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 h-14 rounded-2xl bg-white/[0.05] border-white/10 text-foreground placeholder:text-white/40 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || rateLimitCountdown !== null}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.6)] transition-all duration-300 border-0 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : rateLimitCountdown !== null ? (
                `Wait ${rateLimitCountdown}s`
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
