import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    // Get the correct origin - use X-Forwarded-Host for proxies like ngrok, or NEXT_PUBLIC_BASE_URL
    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
    const origin = forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : process.env.NEXT_PUBLIC_BASE_URL || url.origin

    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('[Auth Callback] Received request:', {
      origin,
      forwardedHost,
      urlOrigin: url.origin,
      hasCode: !!code,
      hasTokenHash: !!token_hash,
      type,
      hasError: !!error,
      errorDescription,
      next
    })

    // Handle OAuth errors
    if (error) {
      console.error('[Auth Callback] OAuth error:', { error, errorDescription })
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent(errorDescription || error)}`
      )
    }

    const supabase = await createClient()

    // Handle email confirmation via token_hash (email confirmation links)
    if (token_hash && type) {
      console.log('[Auth Callback] Verifying OTP with token_hash, type:', type)
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (verifyError) {
        console.error('[Auth Callback] Verify OTP error:', verifyError)
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(verifyError.message || 'Failed to verify email')}`
        )
      }

      console.log('[Auth Callback] Successfully verified OTP, type:', type)

      // Redirect to reset-password page for password recovery
      if (type === 'recovery') {
        console.log('[Auth Callback] Password recovery - redirecting to reset-password')
        return NextResponse.redirect(`${origin}/reset-password`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }

    // Handle OAuth/PKCE code exchange
    if (code) {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('[Auth Callback] Exchange code error:', exchangeError)
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message || 'Failed to exchange code')}`
        )
      }

      console.log('[Auth Callback] Successfully exchanged code for session, user:', data.user?.email)

      // Check if this is a password recovery flow
      // After PKCE exchange, check the session's aal (authenticator assurance level) or user recovery state
      // The session from password recovery has specific characteristics
      const session = data.session
      const user = data.user

      // Check multiple indicators for password recovery:
      // 1. Type parameter (if Supabase passes it)
      // 2. User's recovery_sent_at was recently set
      // 3. The AMR (Authentication Methods Reference) includes recovery
      const amr = session?.user?.amr || []
      const hasRecoveryAmr = amr.some((a: { method: string }) => a.method === 'recovery' || a.method === 'otp')
      const recentRecovery = user?.recovery_sent_at &&
        (new Date().getTime() - new Date(user.recovery_sent_at).getTime()) < 10 * 60 * 1000 // within 10 minutes

      const isRecovery = type === 'recovery' ||
        hasRecoveryAmr ||
        recentRecovery ||
        next === '/reset-password' ||
        searchParams.get('redirect_to')?.includes('reset-password')

      console.log('[Auth Callback] Recovery check:', {
        type,
        hasRecoveryAmr,
        recentRecovery,
        amr,
        isRecovery
      })

      if (isRecovery) {
        console.log('[Auth Callback] PKCE Password recovery - redirecting to reset-password')
        return NextResponse.redirect(`${origin}/reset-password`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('[Auth Callback] No code or token_hash provided')
    // Return user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent('No authentication code provided')}`)
  } catch (err) {
    console.error('[Auth Callback] Unexpected error:', err)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin
    return NextResponse.redirect(
      `${baseUrl}/auth/auth-code-error?error=${encodeURIComponent('An unexpected error occurred')}`
    )
  }
}
