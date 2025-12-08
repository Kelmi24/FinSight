"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle2, TrendingUp, Receipt, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  action?: {
    label: string
    onClick: () => void
  }
}

const ONBOARDING_KEY = "finsight-onboarding-completed"

/**
 * Onboarding component for new users.
 * Displays a welcome guide with key features and getting started steps.
 * 
 * @example
 * ```tsx
 * <Onboarding />
 * ```
 */
export function Onboarding() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if onboarding has been completed
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (!completed) {
      setIsOpen(true)
    }
  }, [])

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to FinSight AI! 👋",
      description: "Your personal financial coach and visualizer. Let's get you started with tracking your finances.",
      icon: CheckCircle2,
    },
    {
      id: "transactions",
      title: "Track Your Transactions",
      description: "Add income and expenses to see where your money goes. You can manually add transactions or import from CSV files.",
      icon: Receipt,
      action: {
        label: "Add Transaction",
        onClick: () => {
          document.getElementById("add-transaction-trigger")?.click()
          handleComplete()
        },
      },
    },
    {
      id: "budgets",
      title: "Set Up Budgets",
      description: "Create budgets for different categories to stay on track with your spending goals.",
      icon: TrendingUp,
      action: {
        label: "Create Budget",
        onClick: () => {
          window.location.href = "/budgets"
          handleComplete()
        },
      },
    },
    {
      id: "goals",
      title: "Define Your Goals",
      description: "Set financial goals and track your progress towards achieving them.",
      icon: Target,
      action: {
        label: "Set Goal",
        onClick: () => {
          window.location.href = "/goals"
          handleComplete()
        },
      },
    },
  ]

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true")
    setIsOpen(false)
  }

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, "true")
    setIsOpen(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full p-2 bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress dots */}
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          
          {step.action ? (
            <Button onClick={step.action.onClick} className="flex-1">
              {step.action.label}
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          )}

          {currentStep < steps.length - 1 && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

/**
 * Hook to manually trigger onboarding.
 * Useful for adding a "Help" or "Tour" button.
 */
export function useOnboarding() {
  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY)
    window.location.reload()
  }

  return { resetOnboarding }
}
