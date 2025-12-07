"use client"

import { useState, useEffect } from "react"
import { WalletCard } from "./WalletCard"
import { WalletDialog } from "./WalletDialog"
import { TransferDialog } from "./TransferDialog"
import { DeleteWalletDialog } from "./DeleteWalletDialog"
import { Button } from "@/components/ui/button"
import { getWallets } from "@/lib/actions/wallets"
import { Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface WalletListProps {
  userId?: string
}

export function WalletList({ userId }: WalletListProps) {
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  
  useEffect(() => {
    fetchWallets()
  }, [])
  
  async function fetchWallets() {
    setLoading(true)
    const data = await getWallets()
    setWallets(data)
    setLoading(false)
  }
  
  function handleEdit(wallet: any) {
    setSelectedWallet(wallet)
    setEditDialogOpen(true)
  }
  
  function handleTransfer(wallet: any) {
    setSelectedWallet(wallet)
    setTransferDialogOpen(true)
  }
  
  function handleDelete(wallet: any) {
    setSelectedWallet(wallet)
    setDeleteDialogOpen(true)
  }
  
  function handleSuccess() {
    fetchWallets()
    setSelectedWallet(null)
  }
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }
  
  if (wallets.length === 0) {
    return (
      <>
        <EmptyState
          title="No wallets yet"
          description="Create your first wallet to start tracking your finances"
          action={
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Wallet
            </Button>
          }
        />
        
        <WalletDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleSuccess}
        />
      </>
    )
  }
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onEdit={() => handleEdit(wallet)}
            onTransfer={() => handleTransfer(wallet)}
            onDelete={() => handleDelete(wallet)}
          />
        ))}
        
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="h-full min-h-[192px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
            <Plus className="h-6 w-6" />
          </div>
          <span className="font-medium">Add Wallet</span>
        </button>
      </div>
      
      {/* Dialogs */}
      <WalletDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSuccess}
      />
      
      <WalletDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setSelectedWallet(null)
        }}
        wallet={selectedWallet}
        onSuccess={handleSuccess}
      />
      
      <TransferDialog
        open={transferDialogOpen}
        onOpenChange={(open) => {
          setTransferDialogOpen(open)
          if (!open) setSelectedWallet(null)
        }}
        fromWallet={selectedWallet}
        onSuccess={handleSuccess}
      />
      
      <DeleteWalletDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setSelectedWallet(null)
        }}
        wallet={selectedWallet}
        onSuccess={handleSuccess}
      />
    </>
  )
}
