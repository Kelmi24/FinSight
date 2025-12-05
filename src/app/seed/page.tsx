"use client"

import { useState } from "react"
import { seedMockTransactions } from "@/lib/actions/seed"
import { Button } from "@/components/ui/button"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSeed = async () => {
    setLoading(true)
    setMessage("Seeding transactions...")
    try {
      const result = await seedMockTransactions()
      setMessage(`✅ Seeded ${result.count} transactions! Refresh your dashboard to see data.`)
    } catch (error) {
      setMessage(`❌ Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seed Mock Data</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          This will create sample transactions so you can test the dashboard and features.
        </p>
      </div>

      <Button onClick={handleSeed} disabled={loading} size="lg">
        {loading ? "Seeding..." : "Seed 8 Sample Transactions"}
      </Button>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes("✅") ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
          <p className={message.includes("✅") ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
            {message}
          </p>
        </div>
      )}
    </div>
  )
}
