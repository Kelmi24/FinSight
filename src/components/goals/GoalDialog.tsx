"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoalForm } from "./GoalForm"

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date | null
}

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal
}

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
        </DialogHeader>
        <GoalForm goal={goal} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
