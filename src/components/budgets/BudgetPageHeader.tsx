"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BudgetDialog } from "./BudgetDialog"

export function BudgetPageHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button id="create-budget-trigger" onClick={() => setIsOpen(true)} variant="default">
        <Plus className="mr-2 h-4 w-4" />
        Create Budget
      </Button>
      <BudgetDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
