"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PieChart, ArrowRightLeft, Target, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Transactions",
    icon: ArrowRightLeft,
    href: "/transactions",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Analytics",
    icon: PieChart,
    href: "/analytics",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Goals",
    icon: Target,
    href: "/goals",
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "from-gray-500 to-slate-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="flex-1 space-y-2 p-4">
        {routes.map((route) => {
          const isActive = pathname === route.href
          
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r text-white shadow-lg scale-105" + " " + route.color
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
              )}
            >
              {/* Gradient border on hover for inactive items */}
              {!isActive && (
                <div className={cn(
                  "absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity",
                  route.color
                )} />
              )}
              
              <route.icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive && "drop-shadow-lg"
              )} />
              
              <span className="relative z-10">{route.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-2 h-2 w-2 rounded-full bg-white shadow-lg animate-pulse" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
