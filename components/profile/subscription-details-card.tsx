"use client"

import { useState, useEffect } from "react"
import { Crown, CreditCard, Clock, Zap, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const planDetails: Record<string, { name: string; color: string; minutes: number }> = {
  free: { name: "Free", color: "cyan", minutes: 5 },
  basic: { name: "Basic", color: "emerald", minutes: 30 },
  pro: { name: "Pro", color: "violet", minutes: 120 },
  max: { name: "Max", color: "amber", minutes: 350 },
}

const brandIcons: Record<string, string> = {
  visa: "Visa",
  mastercard: "MC",
  amex: "Amex",
  discover: "Discover",
  diners: "Diners",
  jcb: "JCB",
  unionpay: "UnionPay",
}

interface SubscriptionData {
  plan: string
  status: string
  amount: number
  interval: string
  currentPeriodEnd: number
  nextBillingDate: string
}

interface PaymentMethodData {
  brand: string
  last4: string
  expMonth: number
  expYear: number
}

interface SubscriptionDetailsCardProps {
  currentPlan: string
  subscriptionStatus: string
  minutesUsed: number
  minutesLimit: number
  isUnlimited: boolean
}

export function SubscriptionDetailsCard({
  currentPlan,
  subscriptionStatus,
  minutesUsed,
  minutesLimit,
  isUnlimited,
}: SubscriptionDetailsCardProps) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plan = planDetails[currentPlan] || planDetails.free
  const isPaid = currentPlan !== "free"

  useEffect(() => {
    if (!isPaid) return

    async function fetchDetails() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/subscription-details")
        if (!res.ok) throw new Error("Failed to fetch subscription details")
        const data = await res.json()
        setSubscription(data.subscription)
        setPaymentMethod(data.paymentMethod)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [isPaid])

  const statusColor =
    subscriptionStatus === "active"
      ? "text-emerald-400"
      : subscriptionStatus === "past_due"
        ? "text-amber-400"
        : "text-red-400"

  const statusDot =
    subscriptionStatus === "active"
      ? "bg-emerald-400"
      : subscriptionStatus === "past_due"
        ? "bg-amber-400"
        : "bg-red-400"

  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-violet-500/10 rounded-3xl blur-xl" />
      <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="font-semibold text-white">Your Subscription</h3>
        </div>

        {/* Plan Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Plan</span>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-${plan.color}-500/20 text-${plan.color}-400`}>
              <Crown className="w-3 h-3" />
              {plan.name}
            </div>
          </div>
          {isPaid && (
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
              <span className={`text-xs font-medium capitalize ${statusColor}`}>
                {subscriptionStatus === "past_due" ? "Past Due" : subscriptionStatus}
              </span>
            </div>
          )}
        </div>

        {/* Billing Info - Only for paid users */}
        {isPaid && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-white/30" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 py-3 text-white/40 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Could not load billing details</span>
              </div>
            ) : subscription ? (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Billing</span>
                  <span className="text-white">
                    ${subscription.amount.toFixed(2)} / {subscription.interval}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Next billing</span>
                  <span className="text-white">
                    {new Date(subscription.nextBillingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="border-t border-white/[0.08] my-4" />

            {/* Payment Method */}
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium text-white/70">Payment Method</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="w-4 h-4 animate-spin text-white/30" />
              </div>
            ) : paymentMethod ? (
              <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-1 rounded">
                    {brandIcons[paymentMethod.brand] || paymentMethod.brand.toUpperCase()}
                  </span>
                  <span className="text-white text-sm font-mono">
                    •••• {paymentMethod.last4}
                  </span>
                </div>
                <span className="text-white/40 text-sm">
                  {String(paymentMethod.expMonth).padStart(2, "0")}/{String(paymentMethod.expYear).slice(-2)}
                </span>
              </div>
            ) : (
              <p className="text-white/30 text-sm">No payment method on file</p>
            )}

            <div className="border-t border-white/[0.08] my-4" />
          </>
        )}

        {/* Listening Time */}
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-4 h-4 text-white/40" />
          <span className="text-sm font-medium text-white/70">Listening Time</span>
        </div>

        {isUnlimited ? (
          <div className="text-center py-3">
            <Zap className="w-7 h-7 text-amber-400 mx-auto mb-1" />
            <p className="text-white font-semibold text-sm">Unlimited</p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-black text-white">{minutesUsed}</span>
              <span className="text-white/40 text-sm">/ {minutesLimit} min</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                style={{ width: `${Math.min((minutesUsed / minutesLimit) * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs">
                {Math.max(minutesLimit - minutesUsed, 0)} minutes remaining
              </p>
              <p className="text-white/30 text-xs">
                {Math.round((minutesUsed / minutesLimit) * 100)}%
              </p>
            </div>
          </>
        )}

        {/* Upgrade CTA */}
        {currentPlan !== "max" && (
          <div className="mt-5">
            <Link href="/products/listen-buddy#pricing">
              <Button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
