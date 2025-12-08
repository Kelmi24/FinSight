"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AmountInputProps {
  label?: string
  value: string | number
  onChange: (value: string) => void
  currency?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
  id?: string
}

/**
 * Shared amount input component with currency formatting
 * Handles decimal input, validation, and display
 * 
 * @example
 * <AmountInput
 *   label="Amount"
 *   value={amount}
 *   onChange={setAmount}
 *   currency="USD"
 *   required
 * />
 */
export function AmountInput({
  label = "Amount",
  value,
  onChange,
  currency,
  placeholder = "0.00",
  error,
  required = false,
  disabled = false,
  className,
  name = "amount",
  id,
}: AmountInputProps) {
  const inputId = id || name

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Allow empty string
    if (inputValue === "") {
      onChange("")
      return
    }
    
    // Allow valid decimal numbers only
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      onChange(inputValue)
    }
  }

  const handleBlur = () => {
    // Format to 2 decimal places on blur if value exists
    if (value && value !== "") {
      const numValue = parseFloat(value.toString())
      if (!isNaN(numValue)) {
        onChange(numValue.toFixed(2))
      }
    }
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {currency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium">
            {currency}
          </span>
        )}
        <Input
          id={inputId}
          name={name}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            currency && "pl-16",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100"
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
