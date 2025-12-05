"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BudgetForm } from "./BudgetForm"

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget?: any
}

export function BudgetDialog({ open, onOpenChange, budget }: BudgetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "Create Budget"}</DialogTitle>
        </DialogHeader>
        <BudgetForm budget={budget} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
