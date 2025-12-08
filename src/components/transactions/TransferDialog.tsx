"use client"

import { useState, useEffect, useTransition } from "react"
import { createTransfer } from "@/lib/actions/transfers"
import { getWallets } from "@/lib/actions/wallets"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useCurrency } from "@/providers/currency-provider"
import { formatAmountPreview } from "@/lib/currency"

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TransferDialog({ open, onOpenChange, onSuccess }: TransferDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [wallets, setWallets] = useState<any[]>([])
  const [fromWalletId, setFromWalletId] = useState("")
  const [toWalletId, setToWalletId] = useState("")
  const [amountInput, setAmountInput] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const { currency, formatCurrency } = useCurrency()

  useEffect(() => {
    async function fetchWallets() {
      const data = await getWallets()
      setWallets(data)
    }
    fetchWallets()
  }, [open])

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createTransfer(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Transfer created successfully")
        onOpenChange(false)
        onSuccess?.()
        // Reset form
        setFromWalletId("")
        setToWalletId("")
        setAmountInput("")
        setNotes("")
        setDate(new Date().toISOString().split("T")[0])
      }
    })
  }

  const fromWallet = wallets.find(w => w.id === fromWalletId)
  const toWallet = wallets.find(w => w.id === toWalletId)
  const amount = parseFloat(amountInput) || 0
  const hasInsufficientBalance = fromWallet && fromWallet.balance < amount
  const amountPreview = formatAmountPreview(amountInput, currency)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Between Wallets</DialogTitle>
          <DialogDescription>
            Move funds from one wallet to another
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="currency" value={currency} />
          <input type="hidden" name="fromWalletId" value={fromWalletId} />
          <input type="hidden" name="toWalletId" value={toWalletId} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="notes" value={notes} />

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              required
              disabled={isPending}
            />
            {amountPreview && (
              <p className="text-xs text-muted-foreground mt-1">
                Preview: {amountPreview}
              </p>
            )}
          </div>

          {/* From Wallet */}
          <div>
            <Label htmlFor="fromWallet">From Wallet *</Label>
            <Select
              value={fromWalletId}
              onValueChange={setFromWalletId}
              disabled={isPending}
            >
              <SelectTrigger id="fromWallet">
                <SelectValue placeholder="Select source wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem 
                    key={wallet.id} 
                    value={wallet.id}
                    disabled={wallet.id === toWalletId}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{wallet.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatCurrency(wallet.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromWallet && (
              <p className={`text-xs mt-1 ${hasInsufficientBalance ? 'text-destructive' : 'text-muted-foreground'}`}>
                Available: {formatCurrency(fromWallet.balance)}
                {hasInsufficientBalance && " (Insufficient balance)"}
              </p>
            )}
          </div>

          {/* Transfer Arrow */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* To Wallet */}
          <div>
            <Label htmlFor="toWallet">To Wallet *</Label>
            <Select
              value={toWalletId}
              onValueChange={setToWalletId}
              disabled={isPending}
            >
              <SelectTrigger id="toWallet">
                <SelectValue placeholder="Select destination wallet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem 
                    key={wallet.id} 
                    value={wallet.id}
                    disabled={wallet.id === fromWalletId}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{wallet.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatCurrency(wallet.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {toWallet && (
              <p className="text-xs text-muted-foreground mt-1">
                Current balance: {formatCurrency(toWallet.balance)}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          {/* Notes (Optional) */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              type="text"
              placeholder="e.g., Monthly savings"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* Preview */}
          {amount > 0 && fromWallet && toWallet && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="font-medium">Transfer Summary</div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">From {fromWallet.name}:</span>
                <span className={hasInsufficientBalance ? "text-destructive" : ""}>
                  {formatCurrency(fromWallet.balance)} → {formatCurrency(fromWallet.balance - amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To {toWallet.name}:</span>
                <span>{formatCurrency(toWallet.balance)} → {formatCurrency(toWallet.balance + amount)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !fromWalletId || !toWalletId || !amount || hasInsufficientBalance}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transfer {amount > 0 && formatCurrency(amount)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
