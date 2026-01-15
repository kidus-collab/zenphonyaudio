"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ExternalLink, Headphones, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColorBends } from "@/components/color-bends"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"

export default function PluginConnectPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()

  const [openingPlugin, setOpeningPlugin] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pluginUrl] = useState(process.env.NEXT_PUBLIC_PLUGIN_URL || "http://localhost:3005")
  const [autoOpening, setAutoOpening] = useState(true)
  const hasAutoOpened = useRef(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/plugin")
    }
  }, [user, authLoading, router])

  // Auto-open plugin after login (only once)
  useEffect(() => {
    if (!authLoading && user && !hasAutoOpened.current && autoOpening) {
      hasAutoOpened.current = true
      // Small delay to let page render
      const timer = setTimeout(() => {
        handleOpenPlugin()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [authLoading, user, autoOpening])

  const handleOpenPlugin = async () => {
    setOpeningPlugin(true)
    setError(null)
    try {
      const response = await fetch('/api/plugin/auth/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pluginUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate token')
      }

      // Open the plugin with the auth token
      // Use a unique window name to ensure a fresh tab opens
      const windowName = `listenbuddy_${Date.now()}`
      window.open(data.plugin_url, windowName)
      setSuccess(true)
    } catch (err) {
      console.error('Error opening plugin:', err)
      setError(err instanceof Error ? err.message : 'Failed to open plugin')
    } finally {
      setOpeningPlugin(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ColorBends Animated Background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Back Link */}
        <Link
          href="/profile"
          className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Profile</span>
        </Link>

        {/* Main Card */}
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-violet-500/20 rounded-[2rem] blur-2xl" />

            {/* Card */}
            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-8 sm:p-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  {openingPlugin ? (
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  ) : (
                    <Headphones className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
                {openingPlugin ? "Connecting..." : "Listen Buddy Plugin"}
              </h1>
              <p className="text-white/50 text-center mb-8">
                {openingPlugin
                  ? "Opening plugin with your account..."
                  : "Open the DAW WebUI plugin with your account"}
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-white/50 text-sm truncate">{user.email}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-sm">
                  Plugin opened! Check your new browser tab.
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
                  {error}
                </div>
              )}

              {/* Button */}
              <Button
                onClick={handleOpenPlugin}
                disabled={openingPlugin}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-lg shadow-lg shadow-violet-500/25 transition-all"
              >
                {openingPlugin ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ExternalLink className="w-5 h-5 mr-2" />
                )}
                {openingPlugin ? "Opening..." : "Open in Plugin"}
              </Button>

              {/* Help Text */}
              <p className="text-white/30 text-xs text-center mt-4">
                Opens in a new window with secure one-time login
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">OR</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Manual Instructions */}
              <div className="text-center">
                <p className="text-white/50 text-sm mb-2">
                  Already have the plugin open?
                </p>
                <p className="text-white/30 text-xs">
                  Just click the button above - it will sign you in automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-white/30 text-sm">
          Part of the{" "}
          <Link href="/" className="text-violet-400 hover:text-violet-300 transition-colors">
            Zenphony
          </Link>
          {" "}ecosystem
        </p>
      </div>
    </div>
  )
}
