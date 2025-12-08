import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

/**
 * Skeleton component for loading states
 * Provides animated placeholder while content is loading
 * 
 * @example
 * <Skeleton className="h-12 w-full" />
 * <Skeleton className="h-4 w-1/2" />
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table skeleton for transaction list loading state
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

/**
 * Card skeleton for dashboard KPI cards
 */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-40" />
    </div>
  )
}

/**
 * Chart skeleton for dashboard charts
 */
export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-end gap-2 h-40">
            <Skeleton className="flex-1" style={{ height: `${Math.random() * 100 + 40}%` }} />
            <Skeleton className="flex-1" style={{ height: `${Math.random() * 100 + 40}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
