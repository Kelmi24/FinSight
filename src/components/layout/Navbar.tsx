import Link from "next/link"
import { Wallet } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-4 shadow-sm dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span>FinSight</span>
        </Link>
        <div className="flex items-center gap-6">
          {/* Placeholder for User Menu */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 shadow-sm" />
        </div>
      </div>
    </nav>
  )
}
