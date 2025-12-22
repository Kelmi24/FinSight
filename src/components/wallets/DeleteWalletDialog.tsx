"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteWallet } from "@/lib/actions/wallets"
import { getWallets } from "@/lib/actions/wallets"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface DeleteWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: any
  onSuccess?: () => void
}

export function DeleteWalletDialog({ open, onOpenChange, wallet, onSuccess }: DeleteWalletDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableWallets, setAvailableWallets] = useState<any[]>([])
  const [selectedWallet, setSelectedWallet] = useState<string>("")
  const [deleteOption, setDeleteOption] = useState<"cancel" | "reassign" | "delete">("cancel")
  
  useEffect(() => {
    if (open && wallet) {
      fetchWallets()
      // If has transactions, default to cancel (force choice). If empty, default to delete.
      if (wallet._count?.transactions > 0) {
        setDeleteOption("cancel")
      } else {
        setDeleteOption("delete")
      }
    }
  }, [open, wallet])
  
  async function fetchWallets() {
    const wallets = await getWallets()
    const others = wallets.filter((w: any) => w.id !== wallet?.id)
    setAvailableWallets(others)
    if (others.length > 0) {
      setSelectedWallet(others[0].id)
    }
  }
  
  async function handleDelete() {
    if (!wallet) return
    
    if (deleteOption === "cancel") {
      onOpenChange(false)
      return
    }
    
    setIsDeleting(true)
    setError(null)
    
    const result = deleteOption === "reassign" 
      ? await deleteWallet(wallet.id, selectedWallet)
      : await deleteWallet(wallet.id)
    
    if (result.error) {
      setError(result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
      onSuccess?.()
      onOpenChange(false)
    }
  }
  
  if (!wallet) return null
  
  const hasTransactions = wallet._count?.transactions > 0
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-lg font-semibold">Delete Wallet</DialogTitle>
          </div>
          <DialogDescription>
            {hasTransactions 
              ? `This wallet has ${wallet._count.transactions} transaction${wallet._count.transactions !== 1 ? 's' : ''}. What would you like to do?`
              : `Are you sure you want to delete "${wallet.name}"?`
            }
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded">
            {error}
          </div>
        )}
        
        {hasTransactions && availableWallets.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deleteOption"
                  value="cancel"
                  checked={deleteOption === "cancel"}
                  onChange={() => setDeleteOption("cancel")}
                  className="rounded-full"
                />
                <span className="text-sm">Cancel deletion</span>
              </label>
              
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="deleteOption"
                  value="reassign"
                  checked={deleteOption === "reassign"}
                  onChange={() => setDeleteOption("reassign")}
                  className="rounded-full mt-0.5"
                />
                <div className="flex-1 space-y-2">
                  <span className="text-sm">Reassign transactions to:</span>
                  {deleteOption === "reassign" && (
                    <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWallets.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.icon} {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </label>
              
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="deleteOption"
                  value="delete"
                  checked={deleteOption === "delete"}
                  onChange={() => setDeleteOption("delete")}
                  className="rounded-full mt-0.5"
                />
                <div>
                  <span className="text-sm">Delete all transactions</span>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    This cannot be undone
                  </p>
                </div>
              </label>
            </div>
          </div>
        ) : hasTransactions ? (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded">
            You must create another wallet before deleting this one, so transactions can be reassigned.
          </div>
        ) : null}
        
        <DialogFooter className="flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting || (hasTransactions && availableWallets.length === 0)}
            className="flex-1"
          >
            {isDeleting ? "Deleting..." : "Delete Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
