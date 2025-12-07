"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react"
import { useCurrency } from "@/providers/currency-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WalletCardProps {
  wallet: {
    id: string
    name: string
    type: string
    balance: number
    icon?: string | null
    color?: string | null
    _count: { transactions: number }
  }
  monthIncome?: number
  monthExpenses?: number
  onEdit: () => void
  onDelete: () => void
  onTransfer: () => void
  onViewDetails?: () => void
}

export function WalletCard({
  wallet,
  monthIncome = 0,
  monthExpenses = 0,
  onEdit,
  onDelete,
  onTransfer,
  onViewDetails
}: WalletCardProps) {
  const { formatCurrency } = useCurrency()
  
  const netChange = monthIncome - monthExpenses
  const isPositive = netChange >= 0
  
  return (
    <Card className="rounded-2xl hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{wallet.icon || "💳"}</span>
            <div>
              <h3 className="font-semibold text-lg">{wallet.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{wallet.type}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={onTransfer}>Transfer</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
          </div>
          
          {(monthIncome > 0 || monthExpenses > 0) && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>{formatCurrency(monthIncome)}</span>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span>{formatCurrency(monthExpenses)}</span>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {wallet._count.transactions} transaction{wallet._count.transactions !== 1 && 's'}
          </p>
          
          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
                View Details
              </Button>
            )}
            <Button size="sm" onClick={onTransfer} className="flex-1">
              Transfer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
