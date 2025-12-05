import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const buttonVariants = ({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
} = {}) => {
  return cn(
    // Base styles - CopperX design
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
      // Primary - solid indigo background
      "bg-primary-600 text-white shadow-sm hover:bg-primary-700":
        variant === "default",
      // Destructive - red
      "bg-red-600 text-white shadow-sm hover:bg-red-700":
        variant === "destructive",
      // Outline - white with border
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400":
        variant === "outline",
      // Secondary - gray background
      "bg-gray-100 text-gray-900 hover:bg-gray-200":
        variant === "secondary",
      // Ghost - transparent
      "text-gray-700 hover:bg-gray-100":
        variant === "ghost",
      // Link - text only
      "text-primary-600 underline-offset-4 hover:underline":
        variant === "link",
      // Sizes
      "h-10 px-4 py-2": size === "default",
      "h-8 px-3 text-sm": size === "sm",
      "h-11 px-6 text-base": size === "lg",
      "h-10 w-10": size === "icon",
    },
    className
  )
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
