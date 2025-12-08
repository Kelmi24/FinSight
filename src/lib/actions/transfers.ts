"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// CREATE wallet-to-wallet transfer
export async function createTransfer(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  
  const fromWalletId = formData.get("fromWalletId") as string
  const toWalletId = formData.get("toWalletId") as string
  const amount = parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string || ""
  const dateStr = formData.get("date") as string
  const date = dateStr ? new Date(dateStr) : new Date()
  
  if (!fromWalletId || !toWalletId || !amount || amount <= 0) {
    return { error: "Invalid transfer data" }
  }
  
  if (fromWalletId === toWalletId) {
    return { error: "Cannot transfer to the same wallet" }
  }
  
  try {
    // Verify both wallets belong to user
    const [fromWallet, toWallet] = await Promise.all([
      (db as any).wallet.findUnique({ where: { id: fromWalletId, userId: session.user.id } }),
      (db as any).wallet.findUnique({ where: { id: toWalletId, userId: session.user.id } })
    ])
    
    if (!fromWallet || !toWallet) {
      return { error: "Wallet not found" }
    }
    
    // Check sufficient balance
    if (fromWallet.balance < amount) {
      return { error: "Insufficient balance in source wallet" }
    }
    
    // Create paired transactions atomically
    const result = await db.$transaction(async (tx: any) => {
      // Create expense transaction (debit from source wallet)
      const expenseTransaction = await tx.transaction.create({
        data: {
          amount,
          currency: fromWallet.currency,
          description: description || `Transfer to ${toWallet.name}`,
          category: "Transfer",
          date,
          type: "transfer",
          walletId: fromWalletId,
          userId: session.user!.id
        }
      })
      
      // Create income transaction (to wallet)
      const incomeTransaction = await tx.transaction.create({
        data: {
          amount,
          currency: toWallet.currency,
          description: description || `Transfer from ${fromWallet.name}`,
          category: "Transfer",
          date,
          type: "transfer",
          walletId: toWalletId,
          userId: session.user!.id,
          transferId: expenseTransaction.id
        }
      })
      
      // Update expense transaction with link to income
      await tx.transaction.update({
        where: { id: expenseTransaction.id },
        data: { transferId: incomeTransaction.id }
      })
      
      // Update wallet balances
      await tx.wallet.update({
        where: { id: fromWalletId },
        data: { balance: { decrement: amount } }
      })
      
      await tx.wallet.update({
        where: { id: toWalletId },
        data: { balance: { increment: amount } }
      })
      
      return { expenseTransaction, incomeTransaction }
    })
    
    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    return { success: true, ...result }
  } catch (error) {
    console.error("Transfer error:", error)
    return { error: "Failed to create transfer" }
  }
}

// SOFT DELETE transfer (marks both paired transactions as deleted)
export async function deleteTransfer(transactionId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  
  try {
    const transaction: any = await (db as any).transaction.findUnique({
      where: { id: transactionId, userId: session.user.id },
      include: { 
        wallet: true, 
        relatedTransfer: { 
          include: { wallet: true } 
        } 
      }
    })
    
    if (!transaction || transaction.type !== 'transfer') {
      return { error: "Transfer not found" }
    }
    
    if (transaction.deletedAt) {
      return { error: "Transfer already deleted" }
    }
    
    const relatedTransfer = transaction.relatedTransfer
    
    await db.$transaction(async (tx: any) => {
      // Soft delete both transactions
      await tx.transaction.update({ 
        where: { id: transaction.id },
        data: { deletedAt: new Date() } as any
      })
      if (relatedTransfer) {
        await tx.transaction.update({ 
          where: { id: relatedTransfer.id },
          data: { deletedAt: new Date() } as any
        })
      }
      
      // Reverse balance changes (add back to source)
      if (transaction.wallet) {
        await tx.wallet.update({
          where: { id: transaction.walletId! },
          data: { balance: { increment: transaction.amount } }
        })
      }
      
      // Reverse balance changes (subtract from destination)
      if (relatedTransfer?.wallet) {
        await tx.wallet.update({
          where: { id: relatedTransfer.walletId! },
          data: { balance: { decrement: relatedTransfer.amount } }
        })
      }
    })
    
    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete transfer" }
  }
}

// RESTORE soft-deleted transfer
export async function restoreTransfer(transactionId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  
  try {
    const transaction: any = await (db as any).transaction.findUnique({
      where: { id: transactionId, userId: session.user.id },
      include: { 
        wallet: true, 
        relatedTransfer: { 
          include: { wallet: true } 
        } 
      }
    })
    
    if (!transaction || transaction.type !== 'transfer') {
      return { error: "Transfer not found" }
    }
    
    if (!transaction.deletedAt) {
      return { error: "Transfer is not deleted" }
    }
    
    const relatedTransfer = transaction.relatedTransfer
    
    await db.$transaction(async (tx: any) => {
      // Restore both transactions
      await tx.transaction.update({ 
        where: { id: transaction.id },
        data: { deletedAt: null } as any
      })
      if (relatedTransfer) {
        await tx.transaction.update({ 
          where: { id: relatedTransfer.id },
          data: { deletedAt: null } as any
        })
      }
      
      // Restore balance changes (subtract from source)
      if (transaction.wallet) {
        await tx.wallet.update({
          where: { id: transaction.walletId! },
          data: { balance: { decrement: transaction.amount } }
        })
      }
      
      // Restore balance changes (add back to destination)
      if (relatedTransfer?.wallet) {
        await tx.wallet.update({
          where: { id: relatedTransfer.walletId! },
          data: { balance: { increment: relatedTransfer.amount } }
        })
      }
    })
    
    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    return { success: true }
  } catch (error) {
    return { error: "Failed to restore transfer" }
  }
}
