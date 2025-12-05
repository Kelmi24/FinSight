import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function KpiCard({ title, value, icon: Icon, trend }: KpiCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 capitalize">
              {title}
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight truncate">{value}</p>
            {trend && (
              <p
                className={`mt-2 text-sm font-medium flex items-center gap-1 ${
                  trend.isPositive
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trend.value}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-primary-50 p-3 sm:p-4 flex-shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
