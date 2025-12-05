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
      
      {/* Invite & Earn Card - CopperX style */}
      <div className="mx-4 mb-4 rounded-xl bg-gray-50 p-4">
        <div className="flex -space-x-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary-200 border-2 border-white" />
          <div className="h-8 w-8 rounded-full bg-primary-300 border-2 border-white" />
          <div className="h-8 w-8 rounded-full bg-primary-400 border-2 border-white" />
        </div>
        <p className="text-sm font-semibold text-gray-900">Invite and Earn</p>
        <p className="text-xs text-gray-500 mt-1">
          Earn 10% of their fees plus $25 in points for every friend you invite.
        </p>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
