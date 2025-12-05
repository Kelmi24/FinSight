import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-7 w-7 text-gray-400" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-gray-500 max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
