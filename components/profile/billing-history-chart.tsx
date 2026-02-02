"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { BillingEvent } from "@/lib/supabase/database.types"

interface BillingHistoryChartProps {
  data: BillingEvent[]
}

export function BillingHistoryChart({ data }: BillingHistoryChartProps) {
  // Group by month
  const monthlyData = new Map<string, { subscription: number; topup: number }>()

  for (const event of data) {
    const month = new Date(event.created_at).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    })
    const existing = monthlyData.get(month) || { subscription: 0, topup: 0 }

    if (event.event_type === "topup_purchased") {
      existing.topup += event.amount_cents / 100
    } else if (
      event.event_type === "subscription_created" ||
      event.event_type === "invoice_paid"
    ) {
      existing.subscription += event.amount_cents / 100
    }

    monthlyData.set(month, existing)
  }

  const chartData = Array.from(monthlyData.entries())
    .map(([month, amounts]) => ({
      month,
      subscription: Math.round(amounts.subscription * 100) / 100,
      topup: Math.round(amounts.topup * 100) / 100,
    }))
    .reverse() // chronological order

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/30">
        <p className="text-sm">No billing history yet</p>
        <p className="text-xs mt-1">Your payment history will appear here</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "white",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
          labelStyle={{ color: "rgba(255,255,255,0.5)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}
        />
        <Bar
          dataKey="subscription"
          stackId="a"
          fill="#8b5cf6"
          radius={[0, 0, 0, 0]}
          name="Subscription"
        />
        <Bar
          dataKey="topup"
          stackId="a"
          fill="#f59e0b"
          radius={[4, 4, 0, 0]}
          name="Top-ups"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
