"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RecurringForm } from "./RecurringForm"

interface RecurringDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recurring?: any
  onSuccess?: () => void
}

export function RecurringDialog({ open, onOpenChange, recurring, onSuccess }: RecurringDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false)
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{recurring ? "Edit Recurring" : "Set Up Recurring Transaction"}</DialogTitle>
        </DialogHeader>
        <RecurringForm recurring={recurring} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
