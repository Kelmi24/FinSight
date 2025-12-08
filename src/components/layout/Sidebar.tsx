"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowRightLeft, Target, Settings, Wallet } from "lucide-react"
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
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              pathname === route.href
                ? "bg-primary-50 text-primary-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <route.icon className={cn(
              "h-5 w-5",
              pathname === route.href ? "text-primary-600" : "text-gray-400"
            )} />
            {route.label}
          </Link>
        ))}
      </div>
      
      <div className="mt-auto border-t border-gray-200 p-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
