"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTransfer } from "@/lib/actions/transfers"
import { getWallets } from "@/lib/actions/wallets"
import { useRouter } from "next/navigation"
import { DatePicker } from "@/components/ui/date-picker"
import { useCurrency } from "@/providers/currency-provider"
import { AlertCircle } from "lucide-react"

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fromWallet?: any
  onSuccess?: () => void
}

export function TransferDialog({ open, onOpenChange, fromWallet, onSuccess }: TransferDialogProps) {
  const router = useRouter()
  const { formatCurrency } = useCurrency()
  const [wallets, setWallets] = useState<any[]>([])
  const [selectedFromWallet, setSelectedFromWallet] = useState(fromWallet?.id || "")
  const [selectedToWallet, setSelectedToWallet] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  
  useEffect(() => {
    if (open) {
      fetchWallets()
      if (fromWallet) {
        setSelectedFromWallet(fromWallet.id)
      }
    }
  }, [open, fromWallet])
  
  async function fetchWallets() {
    const data = await getWallets()
    setWallets(data)
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await createTransfer(formData)
    
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.refresh()
      onSuccess?.()
      onOpenChange(false)
      // Reset form
      setAmount("")
      setSelectedToWallet("")
    }
  }
  
  const fromWalletData = wallets.find(w => w.id === selectedFromWallet)
  const toWalletData = wallets.find(w => w.id === selectedToWallet)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Transfer Between Wallets</DialogTitle>
          <DialogDescription>
            Move funds from one wallet to another
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <Label htmlFor="fromWalletId">From Wallet *</Label>
            <Select
              value={selectedFromWallet}
              onValueChange={setSelectedFromWallet}
              name="fromWalletId"
              required
            >
              <SelectTrigger id="fromWalletId">
                <SelectValue placeholder="Select source wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.icon} {wallet.name} ({formatCurrency(wallet.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="toWalletId">To Wallet *</Label>
            <Select
              value={selectedToWallet}
              onValueChange={setSelectedToWallet}
              name="toWalletId"
              required
            >
              <SelectTrigger id="toWalletId">
                <SelectValue placeholder="Select destination wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets
                  .filter(w => w.id !== selectedFromWallet)
                  .map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.icon} {wallet.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            {fromWalletData && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available: {formatCurrency(fromWalletData.balance)}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g., Investment deposit"
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date *</Label>
            <input type="hidden" name="date" value={date.toISOString()} />
            <DatePicker
              value={date.toISOString().split('T')[0]}
              onChange={(value) => setDate(new Date(value))}
            />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-sm text-blue-900 dark:text-blue-100">
            <p className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                This will create paired transactions in both wallets and update their balances automatically.
              </span>
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedFromWallet || !selectedToWallet}>
              {isSubmitting ? "Transferring..." : "Transfer Funds"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
