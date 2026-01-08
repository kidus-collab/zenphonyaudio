"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Check, Crown, Sparkles, Shield, Zap, Headphones } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "free",
    name: "Free Trial",
    price: 0,
    color: "cyan",
    features: ["5 min full access", "All listening modes", "Limited to 3 analyses"],
    icon: Sparkles,
  },
  {
    id: "economy",
    name: "Economy",
    price: 7.99,
    color: "emerald",
    features: ["30 minutes/month", "Basic frequency analysis", "Email support"],
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    price: 25.00,
    popular: true,
    color: "violet",
    features: ["5 hours/month", "Full analysis suite", "Priority support"],
    icon: Headphones,
  },
  {
    id: "master",
    name: "Master",
    price: 55.00,
    color: "amber",
    features: ["Unlimited listening", "Advanced diagnostics", "Dedicated support"],
    icon: Crown,
  },
]

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const planId = searchParams.get("plan")
    if (planId && plans.find(p => p.id === planId)) {
      setSelectedPlanId(planId)
    } else {
      // Default to pro if no valid plan selected
      setSelectedPlanId("pro")
    }
  }, [searchParams])

  const selectedPlan = plans.find(p => p.id === selectedPlanId)

  const handleCheckout = async () => {
    if (!selectedPlan) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      }
    } catch (err) {
      setError("Failed to initialize checkout. Please try again.")
      console.error("Checkout error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  const Icon = selectedPlan.icon
  const colorMap: Record<string, { accent: string; bg: string; gradient: string }> = {
    cyan: {
      accent: "text-cyan-400",
      bg: "bg-cyan-500",
      gradient: "from-cyan-500 to-cyan-600"
    },
    emerald: {
      accent: "text-emerald-400",
      bg: "bg-emerald-500",
      gradient: "from-emerald-500 to-emerald-600"
    },
    violet: {
      accent: "text-violet-400",
      bg: "bg-violet-500",
      gradient: "from-violet-500 to-violet-600"
    },
    amber: {
      accent: "text-amber-400",
      bg: "bg-amber-500",
      gradient: "from-amber-500 to-amber-600"
    },
  }
  const colors = colorMap[selectedPlan.color]

  return (
    <>
      {/* Back Button */}
      <Link
        href="/products/listen-buddy#pricing"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Plans</span>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left - Order Summary */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Complete Your Purchase
          </h1>

          {/* Selected Plan Card */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${colors.accent} mb-1`}>
                  {selectedPlan.name} Plan
                </h2>
                <p className="text-white/50 text-sm">
                  {selectedPlan.popular && "Most popular choice"}
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-white/60">Monthly Price</span>
                <span className="text-4xl font-bold text-white">
                  ${selectedPlan.price.toFixed(2)}
                </span>
              </div>
              {selectedPlan.price > 0 && (
                <p className="text-white/40 text-sm">
                  Billed monthly. Cancel anytime.
                </p>
              )}
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Check className={`w-5 h-5 ${colors.accent}`} />
              What's Included
            </h3>
            <ul className="space-y-4">
              {selectedPlan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-white/70 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right - Payment & Checkout */}
        <div className="space-y-6">
          {/* Secure Checkout Badge */}
          <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-2xl p-6 border border-violet-500/20 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Secure Checkout
            </h3>
            <p className="text-white/60 text-sm">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/70">{selectedPlan.name} Plan</span>
                <span className="text-white font-semibold">
                  ${selectedPlan.price.toFixed(2)}/mo
                </span>
              </div>

              {selectedPlan.price > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Tax</span>
                  <span className="text-white/50 text-sm">Calculated at checkout</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <span className="text-3xl font-bold text-white">
                  ${selectedPlan.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={loading || selectedPlan.price === 0}
            className={`w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 border-0 ${
              selectedPlan.price === 0
                ? "bg-white/10 text-white/50 cursor-not-allowed"
                : `bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-${selectedPlan.color}-500/25 hover:shadow-${selectedPlan.color}-500/40`
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : selectedPlan.price === 0 ? (
              <>
                Start Free Trial
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </>
            )}
          </Button>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>

          {/* Free Plan Notice */}
          {selectedPlan.price === 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-emerald-400 text-sm">
                No payment required. You'll have full access to start your free trial.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function CheckoutLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
    </div>
  )
}

export default function CheckoutPage() {
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

        {/* Checkout Section */}
        <section className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<CheckoutLoading />}>
              <CheckoutContent />
            </Suspense>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
