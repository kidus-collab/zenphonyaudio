export const PLANS = {
  free: { name: 'Free', minutes: 5, monthlyPrice: 0 },
  basic: { name: 'Basic', minutes: 30, monthlyPrice: 7.99 },
  pro: { name: 'Pro', minutes: 120, monthlyPrice: 29.99 },
  max: { name: 'Max', minutes: 350, monthlyPrice: 69.99 },
} as const

export type PlanId = keyof typeof PLANS

export interface PlanRecommendation {
  currentPlan: PlanId
  recommendedPlan: PlanId
  reason: string
  savings: number
  confidence: 'low' | 'medium' | 'high'
}

interface UsageDataPoint {
  date: string
  minutes_used: number
  cumulative_used: number
  minutes_limit: number
  subscription_plan: string
}

export function calculateRecommendation(
  currentPlan: PlanId,
  usageData: UsageDataPoint[],
  topUpSpendingCents: number = 0
): PlanRecommendation {
  if (usageData.length === 0) {
    return {
      currentPlan,
      recommendedPlan: currentPlan,
      reason: 'Not enough usage data to make a recommendation yet.',
      savings: 0,
      confidence: 'low',
    }
  }

  // Group by month and calculate monthly totals
  const monthlyUsage = new Map<string, number>()
  for (const point of usageData) {
    const month = point.date.substring(0, 7) // YYYY-MM
    monthlyUsage.set(month, (monthlyUsage.get(month) || 0) + point.minutes_used)
  }

  const monthlyValues = Array.from(monthlyUsage.values())
  const avgUsage = monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length
  const peakUsage = Math.max(...monthlyValues)

  // Calculate trend (positive = increasing usage)
  let trend = 0
  if (monthlyValues.length >= 2) {
    const recentHalf = monthlyValues.slice(Math.floor(monthlyValues.length / 2))
    const olderHalf = monthlyValues.slice(0, Math.floor(monthlyValues.length / 2))
    const recentAvg = recentHalf.reduce((a, b) => a + b, 0) / recentHalf.length
    const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length
    trend = recentAvg - olderAvg
  }

  // Usage with 20% headroom
  const targetUsage = trend > 0 ? avgUsage * 1.2 + trend * 0.5 : avgUsage * 1.2

  // Count months over/under limit
  const currentLimit = PLANS[currentPlan].minutes
  const monthsOverLimit = monthlyValues.filter(v => v > currentLimit).length

  // Find optimal plan
  const planIds = Object.keys(PLANS) as PlanId[]
  let recommendedPlan: PlanId = currentPlan

  // Find cheapest plan that covers target usage
  for (const pid of planIds) {
    if (PLANS[pid].minutes >= targetUsage || pid === 'max') {
      recommendedPlan = pid
      break
    }
  }

  // Factor in top-up spending: if top-ups per month > price difference of upgrade, recommend upgrade
  const monthsOfData = Math.max(monthlyValues.length, 1)
  const monthlyTopUpSpend = (topUpSpendingCents / 100) / monthsOfData
  const currentPrice = PLANS[currentPlan].monthlyPrice
  const recommendedPrice = PLANS[recommendedPlan].monthlyPrice
  const priceDifference = recommendedPrice - currentPrice

  // If top-up spending exceeds the price difference of the next tier up, bump recommendation
  if (monthlyTopUpSpend > 0 && recommendedPlan === currentPlan) {
    const currentIndex = planIds.indexOf(currentPlan)
    if (currentIndex < planIds.length - 1) {
      const nextPlan = planIds[currentIndex + 1]
      const nextPriceDiff = PLANS[nextPlan].monthlyPrice - currentPrice
      if (monthlyTopUpSpend >= nextPriceDiff * 0.7) {
        recommendedPlan = nextPlan
      }
    }
  }

  // Calculate savings
  const savings = recommendedPlan !== currentPlan
    ? monthlyTopUpSpend - (PLANS[recommendedPlan].monthlyPrice - currentPrice)
    : 0

  // Build reason
  let reason: string
  let confidence: 'low' | 'medium' | 'high'

  if (recommendedPlan === currentPlan) {
    reason = `Your current ${PLANS[currentPlan].name} plan fits your usage well. You average ${Math.round(avgUsage)} min/month.`
    confidence = monthlyValues.length >= 3 ? 'high' : 'medium'
  } else if (planIds.indexOf(recommendedPlan) > planIds.indexOf(currentPlan)) {
    reason = `You average ${Math.round(avgUsage)} min/month${monthsOverLimit > 0 ? ` and exceeded your limit ${monthsOverLimit} time${monthsOverLimit > 1 ? 's' : ''}` : ''}. The ${PLANS[recommendedPlan].name} plan (${PLANS[recommendedPlan].minutes} min) gives you headroom.`
    confidence = monthlyValues.length >= 3 ? 'high' : 'medium'
  } else {
    reason = `You only use ${Math.round(avgUsage)} min/month on average. The ${PLANS[recommendedPlan].name} plan saves you $${Math.abs(priceDifference).toFixed(2)}/month.`
    confidence = monthlyValues.length >= 3 ? 'high' : 'medium'
  }

  if (monthlyValues.length < 2) {
    confidence = 'low'
  }

  return {
    currentPlan,
    recommendedPlan,
    reason,
    savings: Math.round(savings * 100) / 100,
    confidence,
  }
}
