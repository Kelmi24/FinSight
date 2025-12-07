"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImportDialog } from "./ImportDialog"

export function ImportButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Upload className="mr-2 h-4 w-4" />
        Import CSV
      </Button>
      <ImportDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
