import Link from "next/link"
import { Wallet } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <Link 
          href="/" 
          className="flex items-center gap-3 font-bold text-xl transition-smooth hover:scale-105"
        >
          <div className="rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-2.5 shadow-lg">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="gradient-text">FinSight AI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Placeholder for User Menu */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg ring-2 ring-primary/20" />
        </div>
      </div>
    </nav>
  )
}
