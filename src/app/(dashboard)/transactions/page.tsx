"use client"

import { useState, useEffect, useCallback } from "react"
import { getTransactions } from "@/lib/actions/transactions"
import { getRecurringTransactions } from "@/lib/actions/recurring"
import { TransactionList } from "@/components/transactions/TransactionList"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { TransactionTabs } from "@/components/transactions/TransactionTabs"
import { RecurringList } from "@/components/transactions/RecurringList"
import { RecurringDialog } from "@/components/transactions/RecurringDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([])
  const [filters, setFilters] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"one-time" | "recurring">("one-time")
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false)

  const loadTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getTransactions(filters)
      setTransactions(data)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const loadRecurringTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getRecurringTransactions()
      setRecurringTransactions(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === "one-time") {
      loadTransactions()
    } else {
      loadRecurringTransactions()
    }
  }, [activeTab, loadTransactions, loadRecurringTransactions])

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleTabChange = (tab: "one-time" | "recurring") => {
    setActiveTab(tab)
    setFilters({}) // Reset filters when switching tabs
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Add, edit and review your income and expenses.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            {activeTab === "one-time" ? (
              <TransactionDialog />
            ) : (
              <>
                <Button id="add-recurring-trigger" onClick={() => setIsRecurringDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Set Up Recurring
                </Button>
                <RecurringDialog 
                  open={isRecurringDialogOpen} 
                  onOpenChange={setIsRecurringDialogOpen}
                  onSuccess={loadRecurringTransactions}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TransactionTabs activeTab={activeTab} onTabChange={handleTabChange} />
          {activeTab === "one-time" && (
            <TransactionFilters onFilter={handleFilter} />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : activeTab === "one-time" ? (
        <div>
          <TransactionList 
            transactions={transactions} 
            onDeleteSuccess={loadTransactions}
          />
        </div>
      ) : (
        <RecurringList recurring={recurringTransactions} onDeleteSuccess={loadRecurringTransactions} />
      )}
    </div>
  )
}

