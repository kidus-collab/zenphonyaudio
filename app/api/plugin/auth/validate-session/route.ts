import { NextRequest, NextResponse } from "next/server"
import { createClient as createAdminClient, SupabaseClient } from "@supabase/supabase-js"

// Lazy initialization of admin client
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error("Missing Supabase configuration")
    }

    supabaseAdmin = createAdminClient(url, key)
  }
  return supabaseAdmin
}

/**
 * Validate a saved session token from the JUCE app
 * Called on app startup to check if saved credentials are still valid
 *
 * POST /api/plugin/auth/validate-session
 * Body: { user_id: string }
 * Headers: Authorization: Bearer <saved_auth_token>
 */
export async function POST(request: NextRequest) {
  try {
    // Get the auth token from header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header", valid: false },
        { status: 401 }
      )
    }

    const token = authHeader.replace("Bearer ", "")

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id", valid: false },
        { status: 400 }
      )
    }

    const admin = getSupabaseAdmin()

    // Look up the token in auth_tokens table
    const { data: tokenData, error: tokenError } = await admin
      .from("auth_tokens")
      .select("*")
      .eq("token", token)
      .eq("user_id", user_id)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired token", valid: false },
        { status: 401 }
      )
    }

    // Check if token is expired (tokens are valid for 30 days for persistent sessions)
    const expiresAt = new Date(tokenData.expires_at)
    if (expiresAt < new Date()) {
      // Clean up expired token
      await admin.from("auth_tokens").delete().eq("token", token)

      return NextResponse.json(
        { error: "Token expired", valid: false },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: "User not found", valid: false },
        { status: 404 }
      )
    }

    // Get user from auth
    const { data: { user }, error: userError } = await admin.auth.admin.getUserById(user_id)

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found", valid: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        subscription_tier: profile?.subscription_tier || "free",
        minutes_remaining: profile?.minutes_remaining || 0,
      },
    })
  } catch (error) {
    console.error("Validate session error:", error)
    return NextResponse.json(
      { error: "Internal server error", valid: false },
      { status: 500 }
    )
  }
}
