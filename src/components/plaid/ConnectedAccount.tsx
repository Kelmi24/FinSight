"use client"

import { useState } from "react"
import { Building2, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { unlinkAccount, syncMockTransactions } from "@/lib/actions/plaid-mock"
import { useRouter } from "next/navigation"

interface ConnectedAccountProps {
  institutionName: string
}

export function ConnectedAccount({ institutionName }: ConnectedAccountProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState(false)
  const router = useRouter()

  const handleSync = async () => {
    setIsSyncing(true)
    await syncMockTransactions()
    setIsSyncing(false)
    router.refresh()
  }

  const handleUnlink = async () => {
    if (confirm("Are you sure you want to disconnect this account?")) {
      setIsUnlinking(true)
      await unlinkAccount()
      setIsUnlinking(false)
      router.refresh()
    }
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{institutionName}</h3>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Connected
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleUnlink}
            disabled={isUnlinking}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
