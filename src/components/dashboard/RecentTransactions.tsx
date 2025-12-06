"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/currency"

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  type: string
  amount: number
  currency?: string
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

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <Link href="/transactions">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">No transactions yet.</p>
            <p className="text-sm">Add your first transaction to get started.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, transaction.currency as any)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
