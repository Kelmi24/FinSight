import Link from "next/link"
import { Wallet } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
  return (
    <nav className="border-b bg-white px-4 py-3 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Wallet className="h-6 w-6" />
          <span>FinSight AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Placeholder for User Menu */}
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </nav>
  )
}
