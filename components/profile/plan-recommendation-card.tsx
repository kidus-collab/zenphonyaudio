"use client"

import { TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PLANS, type PlanId, type PlanRecommendation } from "@/lib/plan-recommendation"

interface PlanRecommendationCardProps {
  recommendation: PlanRecommendation
}

const confidenceColors = {
  low: "text-white/30",
  medium: "text-amber-400",
  high: "text-emerald-400",
}

export function PlanRecommendationCard({ recommendation }: PlanRecommendationCardProps) {
  const { currentPlan, recommendedPlan, reason, savings, confidence } = recommendation
  const current = PLANS[currentPlan]
  const recommended = PLANS[recommendedPlan]
  const isUpgrade = currentPlan !== recommendedPlan

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-5">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-violet-400" />
        <h4 className="text-sm font-semibold text-white">Plan Recommendation</h4>
        <span className={`text-[10px] font-medium uppercase tracking-wider ${confidenceColors[confidence]}`}>
          {confidence} confidence
        </span>
      </div>

      {isUpgrade ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/60 text-sm">
              {current.name}
            </div>
            <ArrowRight className="w-4 h-4 text-white/30" />
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              {recommended.name}
            </div>
          </div>
          <p className="text-white/50 text-sm mb-3">{reason}</p>
          {savings > 0 && (
            <p className="text-emerald-400 text-xs mb-3">
              Potential savings: ${savings.toFixed(2)}/mo vs current plan + top-ups
            </p>
          )}
          <Link href="/products/listen-buddy#pricing">
            <Button
              size="sm"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              View {recommended.name} Plan
            </Button>
          </Link>
        </>
      ) : (
        <p className="text-white/50 text-sm">{reason}</p>
      )}
    </div>
  )
}
