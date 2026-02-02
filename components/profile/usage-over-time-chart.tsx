"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import type { UsageDailySnapshot } from "@/lib/supabase/database.types"

interface UsageOverTimeChartProps {
  data: UsageDailySnapshot[]
  minutesLimit: number
  onRangeChange: (range: string) => void
  currentRange: string
}

const ranges = [
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "12m", label: "12 months" },
]

export function UsageOverTimeChart({
  data,
  minutesLimit,
  onRangeChange,
  currentRange,
}: UsageOverTimeChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    minutes: d.minutes_used,
    cumulative: d.cumulative_used,
    limit: d.minutes_limit,
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/30">
        <p className="text-sm">No usage data yet</p>
        <p className="text-xs mt-1">Start using Listen Buddy to see your usage trends</p>
      </div>
    )
  }

  return (
    <div>
      {/* Range Selector */}
      <div className="flex gap-1 mb-4">
        {ranges.map((r) => (
          <button
            key={r.key}
            onClick={() => onRangeChange(r.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              currentRange === r.key
                ? "bg-violet-500/20 text-violet-400"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={false}
            unit=" min"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "white",
              fontSize: "12px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.5)" }}
          />
          <ReferenceLine
            y={minutesLimit}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="5 5"
            label={{
              value: `Limit: ${minutesLimit} min`,
              fill: "rgba(255,255,255,0.3)",
              fontSize: 10,
              position: "right",
            }}
          />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#usageGradient)"
            name="Minutes Used"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
