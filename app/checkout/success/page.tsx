"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, Home, Download } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const session = searchParams.get("session_id")
    if (session) {
      setSessionId(session)
      setLoading(false)
    } else {
      // No session ID, redirect to pricing
      router.push("/products/listen-buddy#pricing")
    }
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
        Payment Successful!
      </h1>
      <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto">
        Welcome to Listen Buddy! Your subscription is now active. You can start using all premium features immediately.
      </p>

      {/* Features List */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-8 border border-white/10 mb-12 text-left">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          What's Next?
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: Download,
              title: "Download the Plugin",
              desc: "Get the Listen Buddy plugin and install it in your DAW",
            },
            {
              icon: CheckCircle2,
              title: "Start Analyzing",
              desc: "Upload your tracks and get instant AI-powered feedback",
            },
            {
              icon: Home,
              title: "Access Your Dashboard",
              desc: "Manage your subscription and view your analysis history",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/signup">
          <Button className="rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-7 text-lg shadow-lg shadow-violet-600/25 transition-all duration-200">
            <Download className="w-6 h-6 mr-2" />
            Download Plugin
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/5 bg-transparent font-semibold px-10 py-7 text-lg"
          >
            <Home className="w-6 h-6 mr-2" />
            Go to Dashboard
          </Button>
        </Link>
      </div>

      {/* Session Info */}
      {sessionId && (
        <div className="mt-12 text-white/30 text-sm">
          Session ID: {sessionId}
        </div>
      )}
    </div>
  )
}

function SuccessLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ColorBends - Full page animated background */}
      <ColorBends
        colors={["#8b5cf6", "#a855f7", "#d946ef", "#7c3aed", "#6366f1"]}
        speed={0.015}
        blur={120}
      />

      <div className="relative z-10">
        <Navigation />

        {/* Success Section */}
        <section className="pt-32 pb-20 px-6 lg:px-8">
          <Suspense fallback={<SuccessLoading />}>
            <SuccessContent />
          </Suspense>
        </section>

        <Footer />
      </div>
    </div>
  )
}
