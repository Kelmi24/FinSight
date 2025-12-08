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
import { ImportButton } from "@/components/transactions/ImportButton"
import { SearchAndDatePresets } from "@/components/transactions/SearchAndDatePresets"
import { TableSkeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useFilter } from "@/providers/filter-provider"

export default function TransactionsPage() {
  const { filters: globalFilters } = useFilter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [recurringTransactions, setRecurringTransactions] = useState<any[]>([])
  const [filters, setFilters] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"one-time" | "recurring">("one-time")
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false)
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const loadTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getTransactions(filters)
      // Keep stored currency and amount as-is to avoid double conversion
      // Apply client-side search filter
      let filtered = data
      if (globalFilters.searchQuery) {
        const query = globalFilters.searchQuery.toLowerCase()
        filtered = data.filter((txn: any) =>
          txn.description?.toLowerCase().includes(query) ||
          txn.category?.toLowerCase().includes(query) ||
          txn.amount?.toString().includes(query)
        )
      }
      setTransactions(filtered)
    } finally {
      setIsLoading(false)
    }
  }, [filters, globalFilters.searchQuery])

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
    setSelectedTransactionIds(new Set()) // Clear selection when filters change
  }

  const handleTabChange = (tab: "one-time" | "recurring") => {
    setActiveTab(tab)
    setFilters({}) // Reset filters when switching tabs
    setSelectedTransactionIds(new Set()) // Clear selection when switching tabs
  }

  const handleSelectionChange = (ids: Set<string>) => {
    setSelectedTransactionIds(ids)
  }

  const handleDeleteSuccess = () => {
    setSelectedTransactionIds(new Set()) // Clear selection after delete
    loadTransactions()
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

        <div className="flex flex-col gap-4">
          <TransactionTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          {activeTab === "one-time" && (
            <>
              <SearchAndDatePresets />
              <div className="flex items-center gap-2 flex-wrap">
                {selectedTransactionIds.size > 0 && (
                  <Button 
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedTransactionIds.size})
                  </Button>
                )}
                <TransactionFilters onFilter={handleFilter} />
                <ImportButton />
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : activeTab === "one-time" ? (
        <div>
          <TransactionList 
            transactions={transactions} 
            onDeleteSuccess={handleDeleteSuccess}
            selectedIds={selectedTransactionIds}
            onSelectionChange={handleSelectionChange}
            showDeleteDialog={showDeleteDialog}
            onDeleteDialogChange={setShowDeleteDialog}
          />
        </div>
      ) : (
        <RecurringList recurring={recurringTransactions} onDeleteSuccess={loadRecurringTransactions} />
      )}
    </div>
  )
}

