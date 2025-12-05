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
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 hover:cursor-pointer active:scale-[0.98]",
    {
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600":
        variant === "default",
      "bg-red-500 text-white shadow-md hover:shadow-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700":
        variant === "destructive",
      "border-2 border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-950 dark:hover:border-blue-400 dark:hover:bg-gray-900":
        variant === "outline",
      "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700":
        variant === "secondary",
      "text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800":
        variant === "ghost",
      "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400":
        variant === "link",
      "h-10 px-4 py-2": size === "default",
      "h-9 px-3 text-sm": size === "sm",
      "h-11 px-8 text-base": size === "lg",
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
