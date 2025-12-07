import { DashboardFilters } from "@/components/dashboard/DashboardFilters"
import { DashboardContent } from "@/components/dashboard/DashboardContent"
import { ConnectedAccount } from "@/components/plaid/ConnectedAccount"
import { ConnectBankButton } from "@/components/plaid/ConnectBankButton"
import { getCategories } from "@/lib/actions/dashboard"

export default async function DashboardPage() {
  const user = {
    institutionName: null,
  }

  // Fetch categories for filter
  const categories = await getCategories()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            A quick overview of your recent activity, balances and trends.
          </p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-3">
          <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">Connected accounts</div>
          <div>
            {user?.institutionName ? (
              <ConnectedAccount institutionName={user.institutionName} />
            ) : (
              <ConnectBankButton />
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <DashboardFilters categories={categories} />

      {/* Dashboard Content (with real-time filter updates) */}
      <DashboardContent />
    </div>
  )
}
