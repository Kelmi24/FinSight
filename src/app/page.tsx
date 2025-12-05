import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, TrendingUp, Target } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to FinSight AI
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Your AI-powered personal financial coach and visualizer
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/transactions"
          className="group relative overflow-hidden rounded-md border bg-white p-6 hover:shadow-lg transition-all duration-medium dark:bg-gray-950 dark:border-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Transactions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your income and expenses
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="group relative overflow-hidden rounded-md border bg-white p-6 hover:shadow-lg transition-all duration-medium dark:bg-gray-950 dark:border-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Dashboard</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View your financial overview
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <div className="relative overflow-hidden rounded-md border bg-white p-6 opacity-50 dark:bg-gray-950 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Goals</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-blue-50 p-6 dark:bg-blue-950/20 dark:border-blue-900">
        <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start by adding your first transaction to begin tracking your finances.
        </p>
        <Link href="/transactions">
          <Button>
            <Wallet className="mr-2 h-4 w-4" />
            Go to Transactions
          </Button>
        </Link>
      </div>
    </div>
  )
}
