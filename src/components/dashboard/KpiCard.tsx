import { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  gradient?: string
}

export function KpiCard({ title, value, icon: Icon, trend, gradient = "from-blue-500 to-cyan-500" }: KpiCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-fade-in">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
            {value}
          </p>
          {trend && (
            <p
              className={`mt-3 text-sm font-medium flex items-center gap-1 ${
                trend.isPositive
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              {trend.value}
            </p>
          )}
        </div>
        
        <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-7 w-7 text-white drop-shadow-lg" />
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  )
}
