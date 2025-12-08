import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Card component variants using class-variance-authority.
 * Provides consistent styling for different card types.
 */
const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-sm",
        elevated: "border-border shadow-md hover:shadow-lg",
        outlined: "border-2 border-border shadow-none",
        ghost: "border-transparent shadow-none bg-transparent",
        success: "border-success bg-success/10 shadow-sm",
        error: "border-destructive bg-destructive/10 shadow-sm",
        warning: "border-warning bg-warning/10 shadow-sm",
        info: "border-info bg-info/10 shadow-sm",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-card-hover hover:border-primary/50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card component - Main container for content grouping.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" interactive>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content here</CardContent>
 *   <CardFooter>Footer actions</CardFooter>
 * </Card>
 * ```
 */
export function Card({ 
  children, 
  className, 
  variant, 
  interactive, 
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader - Header section of a card, typically contains title and description.
 */
export function CardHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  )
}

/**
 * CardTitle - Primary heading for the card.
 */
export function CardTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  )
}

/**
 * CardContent - Main content area of the card.
 */
export function CardContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>
}

/**
 * CardDescription - Secondary text below the title.
 */
export function CardDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

/**
 * CardFooter - Footer section for actions or additional info.
 */
export function CardFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>
}
