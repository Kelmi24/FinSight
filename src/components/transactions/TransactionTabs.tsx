"use client"

import { cn } from "@/lib/utils"

interface TransactionTabsProps {
  activeTab: "one-time" | "recurring"
  onTabChange: (tab: "one-time" | "recurring") => void
}

export function TransactionTabs({ activeTab, onTabChange }: TransactionTabsProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      <button
        onClick={() => onTabChange("one-time")}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
          activeTab === "one-time"
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        One-time
      </button>
      <button
        onClick={() => onTabChange("recurring")}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
          activeTab === "recurring"
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        )}
      >
        Recurring
      </button>
    </div>
  )
}
