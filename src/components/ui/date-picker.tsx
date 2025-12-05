"use client"

import * as React from "react"
import { format, addDays, startOfWeek, addWeeks } from "date-fns"
import { Calendar as CalendarIcon, ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  name?: string
  id?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
  placeholder?: string
  min?: string
  max?: string
  isRecurring?: boolean
  onRecurringChange?: (isRecurring: boolean) => void
  frequency?: string
  onFrequencyChange?: (frequency: string) => void
  interval?: number
  onIntervalChange?: (interval: number) => void
  endDate?: string
  onEndDateChange?: (date: string) => void
}

export function DatePicker({
  name,
  id,
  value,
  onChange,
  required,
  className,
  placeholder = "Pick a date",
  min,
  max,
  isRecurring = false,
  onRecurringChange,
  frequency = "weekly",
  onFrequencyChange,
  interval = 1,
  onIntervalChange,
  endDate,
  onEndDateChange,
}: DatePickerProps) {
  // Committed date (the actual value)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  // Pending date (selected but not confirmed yet)
  const [pendingDate, setPendingDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      setDate(newDate)
      setPendingDate(newDate)
    } else {
      setDate(undefined)
      setPendingDate(undefined)
    }
  }, [value])

  // When popover opens, sync pending date with committed date
  React.useEffect(() => {
    if (isOpen) {
      setPendingDate(date)
    }
  }, [isOpen, date])

  const handleSelect = (newDate: Date | undefined) => {
    setPendingDate(newDate)
  }

  const handleSave = () => {
    setDate(pendingDate)
    if (pendingDate && onChange) {
      onChange(format(pendingDate, "yyyy-MM-dd"))
    } else if (!pendingDate && onChange) {
      onChange("")
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setPendingDate(date)
    setIsOpen(false)
  }

  const handleQuickSelect = (type: "today" | "tomorrow" | "weekend" | "next-week" | "next-weekend" | "2-weeks" | "4-weeks") => {
    const today = new Date()
    let newDate = today

    switch (type) {
      case "today":
        newDate = today
        break
      case "tomorrow":
        newDate = addDays(today, 1)
        break
      case "weekend":
        const day = today.getDay()
        const diff = 6 - day + (day === 6 ? 7 : 0)
        newDate = addDays(today, diff)
        break
      case "next-week":
        newDate = startOfWeek(addDays(today, 7), { weekStartsOn: 1 })
        break
      case "next-weekend":
        const nextWeek = addDays(today, 7)
        const nextDay = nextWeek.getDay()
        const nextDiff = 6 - nextDay + (nextDay === 6 ? 7 : 0)
        newDate = addDays(nextWeek, nextDiff)
        break
      case "2-weeks":
        newDate = addDays(today, 14)
        break
      case "4-weeks":
        newDate = addDays(today, 28)
        break
    }

    setPendingDate(newDate)
  }

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDate(undefined)
    setPendingDate(undefined)
    if (onChange) onChange("")
  }

  // Calculate recurring dates for highlighting
  const getRecurringDates = React.useCallback(() => {
    if (!isRecurring || !pendingDate) return []
    const dates: Date[] = []
    const startDate = pendingDate
    
    for (let i = 0; i < 8; i++) {
      let nextDate: Date
      switch (frequency) {
        case "daily":
          nextDate = addDays(startDate, i)
          break
        case "weekly":
          nextDate = addWeeks(startDate, i)
          break
        case "biweekly":
          nextDate = addWeeks(startDate, i * 2)
          break
        case "monthly":
          nextDate = new Date(startDate)
          nextDate.setMonth(nextDate.getMonth() + i)
          break
        case "yearly":
          nextDate = new Date(startDate)
          nextDate.setFullYear(nextDate.getFullYear() + i)
          break
        default:
          nextDate = addWeeks(startDate, i)
      }
      dates.push(nextDate)
    }
    return dates
  }, [isRecurring, pendingDate, frequency])

  const recurringDates = getRecurringDates()

  return (
    <div className={cn("grid gap-2", className)}>
      <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <div className="flex items-center gap-2 w-full">
                <span>{format(date, "MM/dd/yy")}</span>
                {isRecurring && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">({frequency})</span>
                )}
                <span
                  role="button"
                  onClick={clearDate}
                  className="ml-auto hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-0.5"
                >
                  <X className="h-3 w-3 opacity-50" />
                </span>
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
          sticky="always"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Sidebar */}
            <div className="w-full sm:w-[180px] border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-800 p-2 flex flex-col gap-1">
              {isRecurring ? (
                // Recurring mode sidebar
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Recurring
                  </div>
                  <Select value={frequency} onValueChange={onFrequencyChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 px-2 text-sm font-normal text-gray-500"
                      onClick={() => onRecurringChange?.(false)}
                    >
                      ← Back to one-time
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                // Regular mode sidebar with quick selects
                <>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("today")}
                  >
                    Today <span className="text-xs text-muted-foreground">{format(new Date(), "EEE")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("tomorrow")}
                  >
                    Tomorrow <span className="text-xs text-muted-foreground">{format(addDays(new Date(), 1), "EEE")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("weekend")}
                  >
                    This weekend <span className="text-xs text-muted-foreground">Sat</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("next-week")}
                  >
                    Next week <span className="text-xs text-muted-foreground">Mon</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("next-weekend")}
                  >
                    Next weekend <span className="text-xs text-muted-foreground">{format(addDays(addDays(new Date(), 7), 6 - addDays(new Date(), 7).getDay() + (addDays(new Date(), 7).getDay() === 6 ? 7 : 0)), "d MMM")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("2-weeks")}
                  >
                    2 weeks <span className="text-xs text-muted-foreground">{format(addDays(new Date(), 14), "d MMM")}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between h-8 px-2 text-sm font-normal"
                    onClick={() => handleQuickSelect("4-weeks")}
                  >
                    4 weeks <span className="text-xs text-muted-foreground">{format(addDays(new Date(), 28), "d MMM")}</span>
                  </Button>

                  {onRecurringChange && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between h-8 px-2 text-sm font-medium"
                        )}
                        onClick={() => onRecurringChange(true)}
                      >
                        Set Recurring
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Save/Cancel buttons for one-time */}
                  <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={handleSave}
                        disabled={!pendingDate}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Calendar - always visible */}
            <div className="p-0">
              <Calendar
                mode="single"
                selected={pendingDate}
                onSelect={handleSelect}
                initialFocus
                modifiers={isRecurring ? { recurring: recurringDates } : undefined}
                modifiersStyles={isRecurring ? {
                  recurring: {
                    backgroundColor: "rgb(219 234 254)",
                    borderRadius: "0.375rem",
                  }
                } : undefined}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}


