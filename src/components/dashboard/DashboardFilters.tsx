"use client"

import { useFilter } from "@/providers/filter-provider"
import { getFilterSummary } from "@/lib/filterUtils"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface DashboardFiltersProps {
  categories: string[]
}

export function DashboardFilters({ categories }: DashboardFiltersProps) {
  const { filters, updateFilter, resetFilters, hasActiveFilters, getActiveFilterCount } = useFilter()

  const handleResetFilters = () => {
    resetFilters()
  }

  const activeCount = getActiveFilterCount()
  const filterSummary = getFilterSummary(filters)

  const handleCategoryChange = (category: string) => {
    if (filters.categories.includes(category)) {
      updateFilter('categories', filters.categories.filter(c => c !== category))
    } else {
      updateFilter('categories', [...filters.categories, category])
    }
  }

  const handleDateRangeChange = (range: { startDate: string | null; endDate: string | null }) => {
    updateFilter('startDate', range.startDate)
    updateFilter('endDate', range.endDate)
  }

  return (
    <div className="space-y-4">
      {/* Filter Summary - Subtle */}
      {hasActiveFilters() && (
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              {activeCount}
            </span>
            {filterSummary}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-7 px-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Filter Controls - Compact Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Date Range */}
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Date Range
            </label>
            <DateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={handleDateRangeChange}
              placeholder="Select date range"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-auto sm:min-w-[160px] space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Category
            </label>
            <select
              value={filters.categories[0] || ''}
              onChange={(e) => {
                if (e.target.value) {
                  updateFilter('categories', [e.target.value])
                } else {
                  updateFilter('categories', [])
                }
              }}
              className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-auto sm:min-w-[140px] space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) =>
                updateFilter('type', e.target.value as 'all' | 'income' | 'expense')
              }
              className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {/* Amount Range */}
          <div className="w-full sm:w-auto sm:min-w-[200px] space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Amount Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minAmount ?? ''}
                onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Min"
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors"
              />
              <input
                type="number"
                value={filters.maxAmount ?? ''}
                onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Max"
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          {/* Reset Button - Aligned to bottom */}
          {hasActiveFilters() && (
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="h-10"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
