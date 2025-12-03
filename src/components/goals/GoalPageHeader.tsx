"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoalDialog } from "@/components/goals/GoalDialog"

export function GoalPageHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Goal
      </Button>
      <GoalDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}
