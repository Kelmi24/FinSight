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
    <Card className="hover:scale-[1.02] transition-transform duration-medium">
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight truncate bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{value}</p>
            {trend && (
              <p
                className={`mt-2 text-xs sm:text-sm font-medium flex items-center gap-1 ${
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.value}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 sm:p-4 flex-shrink-0 shadow-lg dark:from-blue-600 dark:to-indigo-700">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
