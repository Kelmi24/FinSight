"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Keyboard } from "lucide-react"

interface Shortcut {
  keys: string[]
  description: string
  category: string
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ["G", "D"], description: "Go to Dashboard", category: "Navigation" },
  { keys: ["G", "T"], description: "Go to Transactions", category: "Navigation" },
  { keys: ["G", "B"], description: "Go to Budgets", category: "Navigation" },
  { keys: ["G", "O"], description: "Go to Goals", category: "Navigation" },
  { keys: ["G", "S"], description: "Go to Settings", category: "Navigation" },
  
  // Actions
  { keys: ["N"], description: "New Transaction", category: "Actions" },
  { keys: ["?"], description: "Show Keyboard Shortcuts", category: "Actions" },
  { keys: ["Esc"], description: "Close Dialog/Modal", category: "Actions" },
  
  // Search & Filter
  { keys: ["/"], description: "Focus Search", category: "Search" },
  { keys: ["Ctrl", "K"], description: "Quick Command (Future)", category: "Search" },
]

/**
 * KeyboardShortcuts - Modal displaying all available keyboard shortcuts.
 * Opens with '?' key press.
 * 
 * @example
 * ```tsx
 * <KeyboardShortcuts />
 * ```
 */
export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show shortcuts dialog on '?'
      if (e.key === "?" && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }

      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Navigation shortcuts (G + key)
      if (e.key.toLowerCase() === "g") {
        const nextKey = (event: KeyboardEvent) => {
          switch (event.key.toLowerCase()) {
            case "d":
              window.location.href = "/dashboard"
              break
            case "t":
              window.location.href = "/transactions"
              break
            case "b":
              window.location.href = "/budgets"
              break
            case "o":
              window.location.href = "/goals"
              break
            case "s":
              window.location.href = "/settings"
              break
          }
          window.removeEventListener("keydown", nextKey)
        }
        window.addEventListener("keydown", nextKey)
      }

      // New transaction
      if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        document.getElementById("add-transaction-trigger")?.click()
      }

      // Focus search
      if (e.key === "/") {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')
        searchInput?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen])

  const categories = Array.from(new Set(shortcuts.map(s => s.category)))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm text-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs px-2 py-0.5"
                            >
                              {key}
                            </Badge>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground text-xs">
                                +
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Tip:</strong> Press <Badge variant="outline" className="mx-1 font-mono text-xs">?</Badge> anytime to view these shortcuts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
