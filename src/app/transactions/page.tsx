import { getTransactions } from "@/lib/actions/transactions"
import { TransactionList } from "@/components/transactions/TransactionList"
import { TransactionDialog } from "@/components/transactions/TransactionDialog"

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your income and expenses.
          </p>
        </div>
        <TransactionDialog />
      </div>

      <TransactionList transactions={transactions} />
    </div>
  )
}
