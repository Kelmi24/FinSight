"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function AppearanceSection() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useState(() => {
    setMounted(true)
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Appearance</h2>
        <p className="text-sm text-gray-500">
          Customize how FinSight AI looks
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-3 block text-gray-700">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                theme === "light"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Light</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                theme === "dark"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Moon className="h-5 w-5" />
              <span className="text-sm font-medium">Dark</span>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                theme === "system"
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <div className="h-4 w-2 rounded-l bg-current" />
                <div className="h-4 w-2 rounded-r bg-current opacity-50" />
              </div>
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
