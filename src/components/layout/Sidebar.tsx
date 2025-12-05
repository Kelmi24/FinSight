"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PieChart, ArrowRightLeft, Target, Settings, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Transactions",
    icon: ArrowRightLeft,
    href: "/transactions",
  },
  {
    label: "Budgets",
    icon: Wallet,
    href: "/budgets",
  },
  {
    label: "Analytics",
    icon: PieChart,
    href: "/analytics",
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800 shadow-sm">
      <div className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
              pathname === route.href
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                : "text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400 dark:hover:shadow-sm"
            )}
          >
            <route.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
        <ThemeToggle />
      </div>
    </div>
  )
}
