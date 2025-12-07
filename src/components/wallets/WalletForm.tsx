"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createWallet, updateWallet } from "@/lib/actions/wallets"
import { useRouter } from "next/navigation"

const WALLET_TYPES = [
  { value: "bank", label: "Bank Account" },
  { value: "cash", label: "Cash" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" }
]

const WALLET_ICONS = ["💳", "🏦", "💰", "💵", "📱", "📈", "💼", "🪙"]

const WALLET_COLORS = [
  "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4", "#14B8A6"
]

interface WalletFormProps {
  wallet?: any
  onSuccess?: () => void
}

export function WalletForm({ wallet, onSuccess }: WalletFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIcon, setSelectedIcon] = useState(wallet?.icon || WALLET_ICONS[0])
  const [selectedColor, setSelectedColor] = useState(wallet?.color || WALLET_COLORS[0])
  const [type, setType] = useState(wallet?.type || "bank")
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.set("icon", selectedIcon)
    formData.set("color", selectedColor)
    formData.set("type", type)
    
    const result = wallet 
      ? await updateWallet(wallet.id, formData)
      : await createWallet(formData)
    
    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.refresh()
      onSuccess?.()
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <Label htmlFor="name">Wallet Name *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={wallet?.name}
          placeholder="e.g., BCA Bank"
        />
      </div>
      
      <div>
        <Label htmlFor="type">Wallet Type *</Label>
        <Select value={type} onValueChange={setType} name="type" required>
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WALLET_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {!wallet && (
        <>
          <div>
            <Label htmlFor="balance">Starting Balance (optional)</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              defaultValue="0"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select name="currency" defaultValue="USD">
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      <div>
        <Label>Icon (optional)</Label>
        <div className="flex gap-2 flex-wrap mt-2">
          {WALLET_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setSelectedIcon(icon)}
              className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                selectedIcon === icon
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label>Color (optional)</Label>
        <div className="flex gap-2 flex-wrap mt-2">
          {WALLET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? "border-gray-900 dark:border-gray-100 scale-110"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          value="true"
          defaultChecked={wallet?.isDefault}
          className="rounded"
        />
        <Label htmlFor="isDefault" className="font-normal">
          Set as default wallet
        </Label>
      </div>
      
      <div className="flex gap-3 justify-end pt-4">
        <Button variant="outline" type="button" onClick={onSuccess} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : wallet ? "Update Wallet" : "Create Wallet"}
        </Button>
      </div>
    </form>
  )
}
