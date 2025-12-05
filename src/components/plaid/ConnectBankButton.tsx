"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { linkMockAccount } from "@/lib/actions/plaid-mock"
import { useRouter } from "next/navigation"

export function ConnectBankButton() {
  const [isLinking, setIsLinking] = useState(false)
  const router = useRouter()

  const handleLink = async () => {
    setIsLinking(true)
    await linkMockAccount()
    setIsLinking(false)
    router.refresh()
  }

  return (
    <Button onClick={handleLink} disabled={isLinking} variant="secondary">
      <CreditCard className={`mr-2 h-4 w-4 ${isLinking ? "animate-spin" : ""}`} />
      {isLinking ? "Connecting..." : "Connect bank"}
    </Button>
  )
}
