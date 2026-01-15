import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient, SupabaseClient } from "@supabase/supabase-js"
import crypto from "crypto"

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

export async function POST(request: NextRequest) {
  try {
    // Get the logged-in user from session
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in first." },
        { status: 401 }
      )
    }

    // Parse request body for plugin URL
    const body = await request.json().catch(() => ({}))
    const pluginUrl = body.pluginUrl || "http://localhost:3005"

    // Generate a secure random token
    const token = `plt_${crypto.randomBytes(32).toString("hex")}`

    // Token expires in 5 minutes (short-lived for security)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    const admin = getSupabaseAdmin()

    // Delete any existing unused tokens for this user (cleanup)
    await admin
      .from("auth_tokens")
      .delete()
      .eq("user_id", user.id)
      .eq("used", false)

    // Insert the new token
    const { error: insertError } = await admin
      .from("auth_tokens")
      .insert({
        user_id: user.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (insertError) {
      console.error("Failed to create auth token:", insertError)
      return NextResponse.json(
        { error: "Failed to generate authentication token" },
        { status: 500 }
      )
    }

    // Get the website's origin for the plugin to use when calling back
    // Use request origin (most reliable) - NEXT_PUBLIC_BASE_URL might point to plugin URL
    const websiteOrigin = request.headers.get('origin') || request.nextUrl.origin

    // Build the plugin URL with the token and api_origin
    const pluginAuthUrl = `${pluginUrl}?auth_token=${token}&api_origin=${encodeURIComponent(websiteOrigin)}`

    return NextResponse.json({
      success: true,
      token: token,
      expires_at: expiresAt.toISOString(),
      plugin_url: pluginAuthUrl,
    })
  } catch (error) {
    console.error("Generate token error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
