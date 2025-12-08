import Link from "next/link"
import { Wallet } from "lucide-react"
import { auth } from "@/auth"
import { UserMenu } from "./UserMenu"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-xl text-gray-900 hover:opacity-80 transition-opacity" aria-label="FinSight Dashboard - Home">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600" aria-hidden="true">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <span>FinSight</span>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link 
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
