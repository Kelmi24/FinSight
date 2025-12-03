"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryChartProps {
  data: Array<{
    category: string
    amount: number
  }>
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
]

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/20">
        <p className="text-muted-foreground">
          No expense data available.
        </p>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-2xl animate-fade-in">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
          Spending by Category
        </h3>
        
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
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
