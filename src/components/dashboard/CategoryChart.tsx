"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryChartProps {
  data: Array<{
    category: string
    amount: number
  }>
}

const COLORS = [
  "#4F46E5", // indigo (primary)
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
        <p className="text-gray-500 font-medium">
          No expense data available.
        </p>
      </div>
    )
  }

  return (
    <Card className="rounded-2xl">
      <CardContent>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
              }
              outerRadius={90}
              innerRadius={45}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`} 
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
