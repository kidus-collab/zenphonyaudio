"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ZenphonyLogo } from "@/components/zenphony-logo"
import { Aurora } from "@/components/aurora"
import { createClient } from "@/lib/supabase/client"
import { Suspense } from "react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    const verifyAndSetupSession = async () => {
      // Debug: Check if environment variables are available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log('[ResetPassword] Environment check:', {
        hasUrl: !!supabaseUrl,
        urlValue: supabaseUrl,
        hasKey: !!supabaseKey,
        keyLength: supabaseKey?.length
      })

      if (!supabaseUrl || !supabaseKey) {
        console.error('[ResetPassword] Missing Supabase environment variables!')
        setError('Configuration error: Missing Supabase credentials')
        setIsValidSession(false)
        return
      }

      const supabase = createClient()
      console.log('[ResetPassword] Supabase client created')

      // Check for token parameters in URL (Supabase adds these)
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      console.log('[ResetPassword] Full URL:', window.location.href)
      console.log('[ResetPassword] URL params:', { code: !!code, tokenHash: !!tokenHash, type, error: errorParam })

      // Handle error from Supabase
      if (errorParam) {
        console.error('[ResetPassword] Error from URL:', errorDescription || errorParam)
        setError(errorDescription || errorParam)
        setIsValidSession(false)
        return
      }

      // FIRST: Check if we already have a valid session (code may have already been exchanged)
      console.log('[ResetPassword] Checking for existing session first...')
      const { data: { session: existingSession } } = await supabase.auth.getSession()

      if (existingSession) {
        // Check if this session is from a recovery flow
        const amr = existingSession.user?.amr || []
        const isRecoverySession = amr.some((a: { method: string }) => a.method === 'recovery' || a.method === 'otp')
        const recentRecovery = existingSession.user?.recovery_sent_at &&
          (new Date().getTime() - new Date(existingSession.user.recovery_sent_at).getTime()) < 10 * 60 * 1000

        console.log('[ResetPassword] Found existing session:', {
          email: existingSession.user?.email,
          isRecoverySession,
          recentRecovery,
          amr
        })

        if (isRecoverySession || recentRecovery) {
          console.log('[ResetPassword] Valid recovery session exists, skipping code exchange')
          setIsValidSession(true)
          return
        }
      }

      // If we have a code (PKCE flow), exchange it for a session
      if (code) {
        console.log('[ResetPassword] Exchanging code for session...')
        console.log('[ResetPassword] Code value:', code.substring(0, 20) + '...')
        console.log('[ResetPassword] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('[ResetPassword] About to call exchangeCodeForSession...')

        // Check for PKCE verifier cookie - this is required for the exchange
        const cookies = document.cookie
        const hasPkceVerifier = cookies.includes('sb-') && cookies.includes('-auth-token-code-verifier')
        console.log('[ResetPassword] Cookies:', cookies)
        console.log('[ResetPassword] Has PKCE verifier cookie:', hasPkceVerifier)

        if (!hasPkceVerifier) {
          console.warn('[ResetPassword] WARNING: No PKCE verifier cookie found!')
          console.warn('[ResetPassword] This usually happens when the password reset was requested from a different domain (localhost vs ngrok)')
          console.warn('[ResetPassword] The user should request the password reset from the same domain they will use to reset')
        }

        try {
          // Log before the call
          console.log('[ResetPassword] Starting exchange NOW - check Network tab')

          // No timeout - let it complete naturally (ngrok can be very slow)
          const result = await supabase.auth.exchangeCodeForSession(code)
          const { data, error: exchangeError } = result

          console.log('[ResetPassword] Exchange completed:', { hasData: !!data, hasError: !!exchangeError })

          if (exchangeError) {
            console.error('[ResetPassword] Code exchange error:', {
              message: exchangeError.message,
              status: exchangeError.status,
              code: exchangeError.code,
              details: exchangeError
            })
            setError(exchangeError.message)
            setIsValidSession(false)
            return
          }

          console.log('[ResetPassword] Code exchanged successfully, user:', data.user?.email)
          setIsValidSession(true)
          return
        } catch (err: any) {
          console.error('[ResetPassword] Code exchange exception:', err?.message || err)
          setError(err?.message || 'Failed to verify reset code')
          setIsValidSession(false)
          return
        }
      }

      // If we have a token_hash (magic link flow), verify it
      if (tokenHash && type) {
        console.log('[ResetPassword] Verifying token_hash...')
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: type as any,
          token_hash: tokenHash,
        })

        if (verifyError) {
          console.error('[ResetPassword] Token verification error:', verifyError)
          setError(verifyError.message)
          setIsValidSession(false)
          return
        }

        console.log('[ResetPassword] Token verified successfully')
        setIsValidSession(true)
        return
      }

      // Check for existing session (user might have come from auth callback)
      console.log('[ResetPassword] Checking for existing session...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('[ResetPassword] Session check result:', { hasSession: !!session, error: sessionError?.message })

      if (session) {
        console.log('[ResetPassword] Existing session found for:', session.user?.email)
        setIsValidSession(true)
        return
      }

      // No valid auth method found
      console.log('[ResetPassword] No valid auth method found')
      setIsValidSession(false)
    }

    // Set a timeout to prevent infinite loading (5 minutes - ngrok can be very slow)
    const timeout = setTimeout(() => {
      console.log('[ResetPassword] Timeout reached after 5 minutes, setting invalid session')
      setIsValidSession(false)
    }, 300000)

    verifyAndSetupSession()

    // Listen for auth state changes (only for session validation, not password updates)
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[ResetPassword] Auth state change:', event)
        if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
          setIsValidSession(true)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [searchParams])

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

      // Refresh the session to ensure we have a valid access token
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      console.log('[ResetPassword] Session refresh:', {
        hasSession: !!refreshData.session,
        email: refreshData.session?.user?.email,
        error: refreshError?.message
      })

      if (refreshError || !refreshData.session) {
        setError("Your session has expired. Please request a new password reset link.")
        setLoading(false)
        return
      }

      console.log('[ResetPassword] Updating password...')

      const { data, error: updateError } = await supabase.auth.updateUser({ password })

      console.log('[ResetPassword] Password update result:', {
        hasData: !!data,
        error: updateError?.message
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
      } else {
        console.log('[ResetPassword] Password updated successfully!')
        // Sign out so user logs in fresh with new password
        await supabase.auth.signOut().catch(() => {})
        setSuccess(true)
        setLoading(false)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err: any) {
      console.error('Error resetting password:', err)
      setError(err?.message || "An unexpected error occurred. Please try again.")
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

function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
