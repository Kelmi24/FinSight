"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface CurrencySelectProps {
  label?: string
  value: CurrencyCode
  onChange: (value: CurrencyCode) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
  id?: string
}

/**
 * Shared currency selection component
 * Displays all supported currencies with symbols
 * 
 * @example
 * <CurrencySelect
 *   label="Currency"
 *   value={currency}
 *   onChange={setCurrency}
 *   required
 * />
 */
export function CurrencySelect({
  label = "Currency",
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
  name = "currency",
  id,
}: CurrencySelectProps) {
  const selectId = id || name

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={selectId}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            error && "border-red-500 focus:border-red-500 focus:ring-red-100"
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : undefined}
        >
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SUPPORTED_CURRENCIES).map(([code, { name, symbol }]) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{symbol}</span>
                <span className="text-gray-600 dark:text-gray-400">{code}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500">- {name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
