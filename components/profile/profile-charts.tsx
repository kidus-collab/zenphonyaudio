"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { BarChart3, Loader2, AlertCircle } from "lucide-react"
import type { UsageDailySnapshot, BillingEvent } from "@/lib/supabase/database.types"
import type { PlanRecommendation, PlanId } from "@/lib/plan-recommendation"

const UsageOverTimeChart = lazy(() =>
  import("./usage-over-time-chart").then((m) => ({ default: m.UsageOverTimeChart }))
)
const BillingHistoryChart = lazy(() =>
  import("./billing-history-chart").then((m) => ({ default: m.BillingHistoryChart }))
)
const PlanComparisonChart = lazy(() =>
  import("./plan-comparison-chart").then((m) => ({ default: m.PlanComparisonChart }))
)
const PlanRecommendationCard = lazy(() =>
  import("./plan-recommendation-card").then((m) => ({ default: m.PlanRecommendationCard }))
)

const tabs = [
  { key: "usage", label: "Usage" },
  { key: "billing", label: "Billing" },
  { key: "plans", label: "Plan Comparison" },
] as const

type TabKey = (typeof tabs)[number]["key"]

interface ProfileChartsProps {
  currentPlan: string
  minutesLimit: number
}

function ChartLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-5 h-5 animate-spin text-white/20" />
    </div>
  )
}

export function ProfileCharts({ currentPlan, minutesLimit }: ProfileChartsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("usage")
  const [usageRange, setUsageRange] = useState("30d")

  const [usageData, setUsageData] = useState<UsageDailySnapshot[]>([])
  const [billingData, setBillingData] = useState<BillingEvent[]>([])
  const [recommendation, setRecommendation] = useState<PlanRecommendation | null>(null)

  const [loadingUsage, setLoadingUsage] = useState(false)
  const [loadingBilling, setLoadingBilling] = useState(false)
  const [loadingRec, setLoadingRec] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch usage data
  useEffect(() => {
    async function fetchUsage() {
      setLoadingUsage(true)
      try {
        const res = await fetch(`/api/usage-history?range=${usageRange}`)
        if (!res.ok) throw new Error("Failed to fetch usage data")
        const json = await res.json()
        setUsageData(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoadingUsage(false)
      }
    }
    fetchUsage()
  }, [usageRange])

  // Fetch billing data on tab switch
  useEffect(() => {
    if (activeTab !== "billing" || billingData.length > 0) return

    async function fetchBilling() {
      setLoadingBilling(true)
      try {
        const res = await fetch("/api/billing-history")
        if (!res.ok) throw new Error("Failed to fetch billing data")
        const json = await res.json()
        setBillingData(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoadingBilling(false)
      }
    }
    fetchBilling()
  }, [activeTab, billingData.length])

  // Fetch recommendation on tab switch
  useEffect(() => {
    if (activeTab !== "plans" || recommendation) return

    async function fetchRec() {
      setLoadingRec(true)
      try {
        const res = await fetch("/api/plan-recommendation")
        if (!res.ok) throw new Error("Failed to fetch recommendation")
        const json = await res.json()
        setRecommendation(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoadingRec(false)
      }
    }
    fetchRec()
  }, [activeTab, recommendation])

  // Calculate avg usage for plan comparison
  const avgUsage =
    usageData.length > 0
      ? usageData.reduce((sum, d) => sum + d.minutes_used, 0) / usageData.length
      : 0

  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-violet-500/10 rounded-3xl blur-xl" />
      <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="font-semibold text-white">Analytics</h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 py-3 text-amber-400/70 text-xs mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Content */}
        <Suspense fallback={<ChartLoader />}>
          {activeTab === "usage" && (
            <>
              {loadingUsage ? (
                <ChartLoader />
              ) : (
                <UsageOverTimeChart
                  data={usageData}
                  minutesLimit={minutesLimit}
                  onRangeChange={setUsageRange}
                  currentRange={usageRange}
                />
              )}
            </>
          )}

          {activeTab === "billing" && (
            <>
              {loadingBilling ? (
                <ChartLoader />
              ) : (
                <BillingHistoryChart data={billingData} />
              )}
            </>
          )}

          {activeTab === "plans" && (
            <>
              {loadingRec ? (
                <ChartLoader />
              ) : (
                <div className="space-y-4">
                  <PlanComparisonChart
                    currentPlan={currentPlan as PlanId}
                    recommendedPlan={recommendation?.recommendedPlan || null}
                    avgUsage={avgUsage}
                  />
                  {recommendation && (
                    <PlanRecommendationCard recommendation={recommendation} />
                  )}
                </div>
              )}
            </>
          )}
        </Suspense>
      </div>
    </div>
  )
}
