"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// GET all wallets for current user
export async function getWallets() {
  const session = await auth()
  if (!session?.user?.id) return []
  
  return await (db as any).wallet.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'asc' }
    ],
    include: {
      _count: {
        select: { transactions: true }
      }
    }
  })
}

// GET single wallet with stats
export async function getWalletById(walletId: string) {
  const session = await auth()
  if (!session?.user?.id) return null
  
  const wallet = await (db as any).wallet.findUnique({
    where: { id: walletId, userId: session.user.id },
    include: {
      transactions: {
        orderBy: { date: 'desc' },
        take: 10
      },
      _count: {
        select: { transactions: true }
      }
    }
  })
  
  if (!wallet) return null
  
  // Calculate income/expense totals
  const transactions = await (db as any).transaction.findMany({
    where: { 
      walletId,
      type: { in: ['income', 'expense'] }
    }
  })
  
  const totalIncome = transactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0)
  
  return { 
    ...wallet, 
    stats: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses
    }
  }
}

// CREATE wallet
export async function createWallet(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const currency = formData.get("currency") as string || "USD"
  const balance = parseFloat(formData.get("balance") as string) || 0
  const icon = formData.get("icon") as string || null
  const color = formData.get("color") as string || null
  const isDefault = formData.get("isDefault") === "true"
  
  if (!name || !type) {
    return { error: "Name and type are required" }
  }
  
  if (balance < 0) {
    return { error: "Starting balance cannot be negative" }
  }
  
  try {
    // Check wallet count limit
    const walletCount = await (db as any).wallet.count({
      where: { userId: session.user.id }
    })
    
    if (walletCount >= 50) {
      return { error: "Maximum wallet limit reached (50 wallets)" }
    }
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await (db as any).wallet.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false }
      })
    }
    
    const wallet = await (db as any).wallet.create({
      data: {
        name,
        type,
        currency,
        balance,
        icon,
        color,
        isDefault,
        userId: session.user.id
      }
    })
    
    revalidatePath("/dashboard")
    return { success: true, wallet }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Wallet name already exists" }
    }
    return { error: "Failed to create wallet" }
  }
}

// UPDATE wallet
export async function updateWallet(walletId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const icon = formData.get("icon") as string || null
  const color = formData.get("color") as string || null
  const isDefault = formData.get("isDefault") === "true"
  
  if (!name || !type) {
    return { error: "Name and type are required" }
  }
  
  try {
    // Verify ownership
    const existing = await (db as any).wallet.findUnique({
      where: { id: walletId, userId: session.user.id }
    })
    
    if (!existing) return { error: "Wallet not found" }
    
    // If setting as default, unset other defaults
    if (isDefault && !existing.isDefault) {
      await (db as any).wallet.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false }
      })
    }
    
    const wallet = await (db as any).wallet.update({
      where: { id: walletId },
      data: { name, type, icon, color, isDefault }
    })
    
    revalidatePath("/dashboard")
    return { success: true, wallet }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Wallet name already exists" }
    }
    return { error: "Failed to update wallet" }
  }
}

// DELETE wallet
export async function deleteWallet(walletId: string, reassignToWalletId?: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }
  
  try {
    // Verify ownership
    const wallet = await (db as any).wallet.findUnique({
      where: { id: walletId, userId: session.user.id },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    })
    
    if (!wallet) return { error: "Wallet not found" }
    
    // Check if it's the only wallet
    const walletCount = await (db as any).wallet.count({
      where: { userId: session.user.id }
    })
    
    if (walletCount === 1) {
      return { error: "Cannot delete your only wallet. Create another wallet first." }
    }
    
    // Check if wallet has transactions
    if (wallet._count.transactions > 0) {
      if (!reassignToWalletId) {
        return { 
          error: "Cannot delete wallet with transactions",
          hasTransactions: true,
          transactionCount: wallet._count.transactions
        }
      }
      
      // Verify reassign target exists and is owned by user
      const targetWallet = await (db as any).wallet.findUnique({
        where: { id: reassignToWalletId, userId: session.user.id }
      })
      
      if (!targetWallet) {
        return { error: "Target wallet not found" }
      }
      
      // Reassign transactions
      await (db as any).transaction.updateMany({
        where: { walletId },
        data: { walletId: reassignToWalletId }
      })
      
      // Recalculate balance
      await recalculateWalletBalance(reassignToWalletId)
    }
    
    // Delete the wallet
    await (db as any).wallet.delete({
      where: { id: walletId }
    })
    
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete wallet" }
  }
}

// Helper: Recalculate wallet balance from transactions
async function recalculateWalletBalance(walletId: string) {
  const transactions = await (db as any).transaction.findMany({
    where: { walletId },
    select: { amount: true, type: true }
  })
  
  const balance = transactions.reduce((sum: number, txn: any) => {
    if (txn.type === 'income') return sum + txn.amount
    if (txn.type === 'expense') return sum - txn.amount
    return sum // transfers don't affect balance (handled separately)
  }, 0)
  
  await (db as any).wallet.update({
    where: { id: walletId },
    data: { balance }
  })
}

// GET wallet statistics for dashboard
export async function getWalletStats(walletId: string, startDate?: Date, endDate?: Date) {
  const session = await auth()
  if (!session?.user?.id) return null
  
  const where: any = { 
    walletId,
    userId: session.user.id
  }
  
  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = startDate
    if (endDate) where.date.lte = endDate
  }
  
  const transactions = await db.transaction.findMany({
    where,
    select: { amount: true, type: true }
  })
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  return {
    income,
    expenses,
    net: income - expenses,
    transactionCount: transactions.length
  }
}
