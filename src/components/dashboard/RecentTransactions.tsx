import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  type: string
  amount: number
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-2xl animate-fade-in">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            Recent Transactions
          </h3>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No transactions yet. Add your first transaction to get started.
          </p>
        ) : (
          <div className="space-y-1">
            {transactions.slice(0, 5).map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <p
                  className={`font-semibold text-lg ${
                    transaction.type === "income"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
