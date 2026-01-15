"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { ColorBends } from "@/components/color-bends"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Check, Crown, Sparkles, Shield, Zap, Headphones, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    color: "cyan",
    minutes: 5,
    features: ["5 analysis minutes/month", "All listening modes", "Plugin chat (limited)", "Try before you buy"],
    icon: Sparkles,
  },
  {
    id: "basic",
    name: "Basic",
    price: 7.99,
    yearlyPrice: 85,
    color: "emerald",
    minutes: 30,
    features: ["30 analysis minutes/month", "All listening modes", "Plugin chat (unlimited)", "Email support"],
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.99,
    yearlyPrice: 320,
    popular: true,
    color: "violet",
    minutes: 120,
    features: ["120 analysis minutes/month", "All listening modes", "Plugin chat (unlimited)", "Priority support"],
    icon: Headphones,
  },
  {
    id: "max",
    name: "Max",
    price: 69.99,
    yearlyPrice: 830,
    color: "amber",
    minutes: 350,
    features: ["350 analysis minutes/month", "All listening modes", "Plugin chat (unlimited)", "Dedicated support"],
    icon: Crown,
  },
]

const topUps = [
  {
    id: "small",
    name: "Small",
    price: 4.99,
    minutes: 20,
    pricePerMin: 0.25,
    color: "cyan",
    icon: Plus,
  },
  {
    id: "medium",
    name: "Medium",
    price: 9.99,
    minutes: 45,
    pricePerMin: 0.222,
    color: "violet",
    popular: true,
    icon: Plus,
  },
  {
    id: "large",
    name: "Large",
    price: 19.99,
    minutes: 80,
    pricePerMin: 0.25,
    color: "amber",
    icon: Plus,
  },
]

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [selectedTopUpId, setSelectedTopUpId] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTopUp = !!searchParams.get("topup")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const topUpId = searchParams.get("topup")
      const planId = searchParams.get("plan") || "pro"
      const billing = searchParams.get("billing") || "monthly"
      if (topUpId) {
        router.push(`/login?redirect=${encodeURIComponent(`/checkout?topup=${topUpId}`)}`)
      } else {
        router.push(`/login?redirect=${encodeURIComponent(`/checkout?plan=${planId}&billing=${billing}`)}`)
      }
    }
  }, [user, authLoading, router, searchParams])

  useEffect(() => {
    const topUpId = searchParams.get("topup")
    const planId = searchParams.get("plan")
    const billing = searchParams.get("billing") as "monthly" | "yearly"

    if (topUpId && topUps.find(t => t.id === topUpId)) {
      setSelectedTopUpId(topUpId)
      setSelectedPlanId(null)
    } else if (planId && plans.find(p => p.id === planId)) {
      setSelectedPlanId(planId)
      setSelectedTopUpId(null)
    } else {
      // Default to pro plan if no valid selection
      setSelectedPlanId("pro")
      setSelectedTopUpId(null)
    }

    if (billing === "monthly" || billing === "yearly") {
      setBillingPeriod(billing)
    }
  }, [searchParams])

  // Show loading while checking auth
  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId)
  const selectedTopUp = topUps.find(t => t.id === selectedTopUpId)

  const handleCheckout = async () => {
    if ((!selectedPlan && !selectedTopUp) || !user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan?.id,
          topUpId: selectedTopUp?.id,
          billingPeriod: billingPeriod,
          email: user.email,
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

  if (!selectedPlan && !selectedTopUp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

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

  // Top-up checkout view
  if (selectedTopUp) {
    const Icon = selectedTopUp.icon
    const colors = colorMap[selectedTopUp.color]

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
              Top Up Your Minutes
            </h1>

            {/* Selected Top-up Card */}
            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold ${colors.accent} mb-1`}>
                    {selectedTopUp.name} Top-up
                  </h2>
                  <p className="text-white/50 text-sm">
                    {selectedTopUp.popular && "Best value option"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-white/60">One-time Purchase</span>
                  <span className="text-4xl font-bold text-white">
                    ${selectedTopUp.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-white/40 text-sm">
                  {selectedTopUp.minutes} extra analysis minutes
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl p-8 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Check className={`w-5 h-5 ${colors.accent}`} />
                What You Get
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-white/70 text-base">{selectedTopUp.minutes} extra analysis minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-white/70 text-base">Minutes never expire</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-white/70 text-base">Use with any listening mode</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className={`w-5 h-5 ${colors.accent} flex-shrink-0 mt-0.5`} />
                  <span className="text-white/70 text-base">${selectedTopUp.pricePerMin.toFixed(3)} per minute</span>
                </li>
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
                  <span className="text-white/70">{selectedTopUp.name} Top-up ({selectedTopUp.minutes} min)</span>
                  <span className="text-white font-semibold">
                    ${selectedTopUp.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Tax</span>
                  <span className="text-white/50 text-sm">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-3xl font-bold text-white">
                    ${selectedTopUp.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 border-0 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Buy {selectedTopUp.minutes} Minutes
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
                <span>One-time Payment</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Subscription plan checkout view
  const Icon = selectedPlan!.icon
  const colors = colorMap[selectedPlan!.color]
  const displayPrice = billingPeriod === "monthly" ? selectedPlan!.price : selectedPlan!.yearlyPrice
  const priceLabel = billingPeriod === "monthly" ? "/mo" : "/yr"

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
                  {selectedPlan!.name} Plan
                </h2>
                <p className="text-white/50 text-sm">
                  {selectedPlan!.popular && "Most popular choice"}
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-white/60">{billingPeriod === "monthly" ? "Monthly" : "Yearly"} Price</span>
                <span className="text-4xl font-bold text-white">
                  ${displayPrice.toFixed(2)}
                </span>
              </div>
              {selectedPlan!.price > 0 && (
                <p className="text-white/40 text-sm">
                  Billed {billingPeriod}. Cancel anytime.
                </p>
              )}
              {billingPeriod === "yearly" && selectedPlan!.price > 0 && (
                <p className="text-emerald-400 text-sm mt-1">
                  Save ${((selectedPlan!.price * 12) - selectedPlan!.yearlyPrice).toFixed(0)} per year
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
              {selectedPlan!.features.map((feature, i) => (
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
                <span className="text-white/70">{selectedPlan!.name} Plan ({billingPeriod})</span>
                <span className="text-white font-semibold">
                  ${displayPrice.toFixed(2)}{priceLabel}
                </span>
              </div>

              {selectedPlan!.price > 0 && (
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
                  ${displayPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={loading || selectedPlan!.price === 0}
            className={`w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 border-0 ${
              selectedPlan!.price === 0
                ? "bg-white/10 text-white/50 cursor-not-allowed"
                : `bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-${selectedPlan!.color}-500/25 hover:shadow-${selectedPlan!.color}-500/40`
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : selectedPlan!.price === 0 ? (
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
          {selectedPlan!.price === 0 && (
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
