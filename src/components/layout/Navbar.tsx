import Link from "next/link"
import { Wallet } from "lucide-react"
import { auth } from "@/auth"
import { UserMenu } from "./UserMenu"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 shadow-sm dark:border-gray-800 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span>FinSight</span>
        </Link>
        <div className="flex items-center gap-6">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link 
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
