"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WalletForm } from "./WalletForm"

interface WalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet?: any
  onSuccess?: () => void
}

export function WalletDialog({ open, onOpenChange, wallet, onSuccess }: WalletDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{wallet ? "Edit Wallet" : "Create New Wallet"}</DialogTitle>
        </DialogHeader>
        <WalletForm wallet={wallet} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
