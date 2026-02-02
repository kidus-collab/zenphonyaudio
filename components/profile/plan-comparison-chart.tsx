"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts"
import { PLANS, type PlanId } from "@/lib/plan-recommendation"

interface PlanComparisonChartProps {
  currentPlan: PlanId
  recommendedPlan: PlanId | null
  avgUsage: number
}

export function PlanComparisonChart({
  currentPlan,
  recommendedPlan,
  avgUsage,
}: PlanComparisonChartProps) {
  const chartData = (Object.entries(PLANS) as [PlanId, (typeof PLANS)[PlanId]][]).map(
    ([id, plan]) => ({
      name: plan.name,
      minutes: plan.minutes,
      price: plan.monthlyPrice,
      id,
    })
  )

  const getBarColor = (id: string) => {
    if (id === recommendedPlan && id !== currentPlan) return "#22c55e"
    if (id === currentPlan) return "#8b5cf6"
    return "rgba(255,255,255,0.1)"
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={false}
            unit=" min"
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "white",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [
              `${value} min`,
              "Limit",
            ]}
            labelStyle={{ color: "rgba(255,255,255,0.5)" }}
          />
          {avgUsage > 0 && (
            <ReferenceLine
              x={avgUsage}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{
                value: `Your avg: ${Math.round(avgUsage)} min`,
                fill: "#f59e0b",
                fontSize: 10,
                position: "top",
              }}
            />
          )}
          <Bar dataKey="minutes" radius={[0, 6, 6, 0]} name="Plan Limit">
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={getBarColor(entry.id)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
          <span className="text-white/40 text-xs">Current plan</span>
        </div>
        {recommendedPlan && recommendedPlan !== currentPlan && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-white/40 text-xs">Recommended</span>
          </div>
        )}
        {avgUsage > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 bg-amber-500" />
            <span className="text-white/40 text-xs">Your avg usage</span>
          </div>
        )}
      </div>
    </div>
  )
}
