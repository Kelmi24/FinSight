import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, TrendingUp, Target, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 px-4 py-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="gradient-text">AI-Powered Financial Intelligence</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to <span className="gradient-text">FinSight AI</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your intelligent personal financial coach and visualizer. Track, analyze, and optimize your finances with AI-powered insights.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Transactions - Active */}
        <Link
          href="/transactions"
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Transactions</h3>
              <p className="text-sm text-muted-foreground">
                Manage your income and expenses
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
          </div>
        </Link>

        {/* Dashboard - Active */}
        <Link
          href="/dashboard"
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your financial health
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
          </div>
        </Link>

        {/* Goals - Coming Soon */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-lg opacity-60">
          <div className="relative flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Goals</h3>
              <p className="text-sm text-muted-foreground">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started CTA */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative space-y-4">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <p className="text-muted-foreground max-w-2xl">
            Start by exploring your dashboard to see your financial overview, or add your first transaction to begin tracking your finances.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
            <Link href="/transactions">
              <Button size="lg" variant="outline" className="hover:bg-primary/10">
                <Wallet className="mr-2 h-5 w-5" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
