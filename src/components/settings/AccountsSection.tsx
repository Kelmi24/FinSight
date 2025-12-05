"use client"

import { Building2 } from "lucide-react"
import { ConnectedAccount } from "@/components/plaid/ConnectedAccount"
import { ConnectBankButton } from "@/components/plaid/ConnectBankButton"
import { Card } from "@/components/ui/card"

interface AccountsSectionProps {
  institutionName: string | null
}

export function AccountsSection({ institutionName }: AccountsSectionProps) {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-full bg-green-100 p-2">
          <Building2 className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Connected Accounts</h2>
          <p className="text-sm text-gray-500">
            Manage your linked bank accounts
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {institutionName ? (
          <ConnectedAccount institutionName={institutionName} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8">
            <Building2 className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">No accounts connected</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Connect your bank account to automatically sync transactions
            </p>
            <ConnectBankButton />
          </div>
        )}
      </div>
    </Card>
  )
}
