"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { linkMockAccount } from "@/lib/actions/plaid-mock"
import { useRouter } from "next/navigation"

export function ConnectBankButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await linkMockAccount()
      router.refresh()
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading} className="w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Bank Account"}
    </Button>
  )
}
