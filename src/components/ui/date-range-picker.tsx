"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, subMonths, isAfter, isBefore, startOfDay } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  startDate?: string | null
  endDate?: string | null
  onChange: (range: { startDate: string | null; endDate: string | null }) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

type PresetKey = "today" | "yesterday" | "last7" | "last30" | "thisMonth" | "lastMonth" | "custom"

interface Preset {
  label: string
  getRange: () => { from: Date; to: Date }
}

const PRESETS: Record<Exclude<PresetKey, "custom">, Preset> = {
  today: {
    label: "Today",
    getRange: () => {
      const today = startOfDay(new Date())
      return { from: today, to: today }
    },
  },
  yesterday: {
    label: "Yesterday",
    getRange: () => {
      const yesterday = startOfDay(subDays(new Date(), 1))
      return { from: yesterday, to: yesterday }
    },
  },
  last7: {
    label: "Last 7 Days",
    getRange: () => {
      const today = startOfDay(new Date())
      return { from: subDays(today, 6), to: today }
    },
  },
  last30: {
    label: "Last 30 Days",
    getRange: () => {
      const today = startOfDay(new Date())
      return { from: subDays(today, 29), to: today }
    },
  },
  thisMonth: {
    label: "This Month",
    getRange: () => {
      const today = startOfDay(new Date())
      return { from: startOfMonth(today), to: today }
    },
  },
  lastMonth: {
    label: "Last Month",
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    },
  },
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "Select date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  // Parse committed dates
  const committedRange: DateRange = {
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  }

  // Pending range (selected but not saved)
  const [pendingRange, setPendingRange] = React.useState<DateRange>(committedRange)
  const [isOpen, setIsOpen] = React.useState(false)
  const [activePreset, setActivePreset] = React.useState<PresetKey | null>(null)

  // Sync pending with committed when popover opens
  React.useEffect(() => {
    if (isOpen) {
      setPendingRange(committedRange)
      setActivePreset(null)
    }
  }, [isOpen])

  // Update pending range when props change (external updates)
  React.useEffect(() => {
    if (!isOpen) {
      setPendingRange(committedRange)
    }
  }, [startDate, endDate])

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setPendingRange({ from: undefined, to: undefined })
      setActivePreset("custom")
      return
    }

    // If both dates exist and from > to, swap them
    let { from, to } = range
    if (from && to && isAfter(from, to)) {
      ;[from, to] = [to, from]
    }

    setPendingRange({ from, to })
    setActivePreset("custom")
  }

  const handlePresetClick = (key: Exclude<PresetKey, "custom">) => {
    const { from, to } = PRESETS[key].getRange()
    setPendingRange({ from, to })
    setActivePreset(key)
  }

  const handleSave = () => {
    const newStartDate = pendingRange.from ? format(pendingRange.from, "yyyy-MM-dd") : null
    const newEndDate = pendingRange.to ? format(pendingRange.to, "yyyy-MM-dd") : null
    onChange({ startDate: newStartDate, endDate: newEndDate })
    setIsOpen(false)
  }

  const handleCancel = () => {
    setPendingRange(committedRange)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange({ startDate: null, endDate: null })
    setPendingRange({ from: undefined, to: undefined })
  }

  // Format display text
  const getDisplayText = () => {
    if (!committedRange.from) return placeholder

    const fromStr = format(committedRange.from, "MMM d")
    if (!committedRange.to) return fromStr

    const toStr = format(committedRange.to, "MMM d, yyyy")
    const fromYear = committedRange.from.getFullYear()
    const toYear = committedRange.to.getFullYear()

    if (fromYear === toYear) {
      return `${fromStr} — ${toStr}`
    }
    return `${format(committedRange.from, "MMM d, yyyy")} — ${toStr}`
  }

  const hasSelection = committedRange.from || committedRange.to

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !hasSelection && "text-gray-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          <span className="flex-1 truncate">{getDisplayText()}</span>
          {hasSelection && (
            <X
              className="ml-2 h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Calendar */}
          <Calendar
            mode="range"
            selected={pendingRange}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            defaultMonth={pendingRange.from || new Date()}
            classNames={{
              day_button: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                "hover:bg-gray-100 dark:hover:bg-gray-700"
              ),
              range_start: "day-range-start rounded-l-md bg-primary-600 text-white hover:bg-primary-600 hover:text-white",
              range_end: "day-range-end rounded-r-md bg-primary-600 text-white hover:bg-primary-600 hover:text-white",
              range_middle: "bg-primary-100 dark:bg-primary-900/30 text-gray-900 dark:text-gray-100 rounded-none",
              selected: "bg-primary-600 text-white",
            }}
          />

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

          {/* Quick Select Presets */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Quick Select
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESETS) as Exclude<PresetKey, "custom">[]).map((key) => (
                <Button
                  key={key}
                  variant={activePreset === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetClick(key)}
                  className={cn(
                    "text-xs h-8",
                    activePreset === key && "bg-primary-600 text-white hover:bg-primary-700"
                  )}
                >
                  {PRESETS[key].label}
                </Button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
