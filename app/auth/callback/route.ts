import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('[Auth Callback] Received request:', {
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

      console.log('[Auth Callback] Successfully exchanged code for session')
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('[Auth Callback] No code or token_hash provided')
    // Return user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent('No authentication code provided')}`)
  } catch (err) {
    console.error('[Auth Callback] Unexpected error:', err)
    const { origin } = new URL(request.url)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent('An unexpected error occurred')}`
    )
  }
}
