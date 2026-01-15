import { NextRequest, NextResponse } from "next/server"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Lazy initialization of admin client
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error("Missing Supabase configuration")
    }

    supabaseAdmin = createClient(url, key)
  }
  return supabaseAdmin
}

// CORS headers for cross-origin requests from the plugin
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    // Get token from request body
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate token format
    if (!token.startsWith("plt_") || token.length !== 68) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Look up the token
    const { data: authToken, error: tokenError } = await getSupabaseAdmin()
      .from("auth_tokens")
      .select("*")
      .eq("token", token)
      .single()

    if (tokenError || !authToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401, headers: corsHeaders }
      )
    }

    // Check if token is expired
    if (new Date(authToken.expires_at) < new Date()) {
      // Delete expired token
      await getSupabaseAdmin()
        .from("auth_tokens")
        .delete()
        .eq("id", authToken.id)

      return NextResponse.json(
        { error: "Token has expired. Please generate a new one." },
        { status: 401, headers: corsHeaders }
      )
    }

    // Check if token was already used
    if (authToken.used) {
      return NextResponse.json(
        { error: "Token has already been used. Please generate a new one." },
        { status: 401, headers: corsHeaders }
      )
    }

    // Mark token as used
    await getSupabaseAdmin()
      .from("auth_tokens")
      .update({ used: true })
      .eq("id", authToken.id)

    // Get the user's profile
    console.log("[exchange-token] Looking up profile for user_id:", authToken.user_id)

    const { data: profile, error: profileError } = await getSupabaseAdmin()
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        company,
        job_title,
        subscription_plan,
        subscription_status,
        listening_minutes_used,
        listening_minutes_limit,
        created_at
      `)
      .eq("id", authToken.user_id)
      .single()

    if (profileError || !profile) {
      console.error("[exchange-token] Profile lookup failed:")
      console.error("[exchange-token] user_id:", authToken.user_id)
      console.error("[exchange-token] profileError:", profileError)
      console.error("[exchange-token] profile:", profile)
      return NextResponse.json(
        { error: "User profile not found", debug: { user_id: authToken.user_id, profileError: profileError?.message } },
        { status: 404, headers: corsHeaders }
      )
    }

    // Calculate minutes info
    const subscriptionRemaining = Math.max(
      0,
      (profile.listening_minutes_limit || 0) - (profile.listening_minutes_used || 0)
    )
    // topup_minutes column may not exist, default to 0
    const topupMinutes = (profile as any).topup_minutes || 0
    const totalAvailable = subscriptionRemaining + topupMinutes

    // Return user data for the plugin
    // Note: Some columns (subscription_period, topup_minutes, api_key) may not exist in all schemas
    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        company: profile.company,
        job_title: profile.job_title,
        created_at: profile.created_at,
      },
      subscription: {
        plan: profile.subscription_plan,
        status: profile.subscription_status,
        period: (profile as any).subscription_period || 'monthly',
      },
      minutes: {
        subscription_limit: profile.listening_minutes_limit || 0,
        subscription_used: profile.listening_minutes_used || 0,
        subscription_remaining: subscriptionRemaining,
        topup_balance: topupMinutes,
        total_available: totalAvailable,
      },
      api_key: (profile as any).api_key || null,
    }, { headers: corsHeaders })
  } catch (error) {
    console.error("Exchange token error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}
