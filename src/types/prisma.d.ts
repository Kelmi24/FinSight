// Type augmentation for Prisma Client with Wallet model
// This file extends the Prisma types to include the Wallet model and relations
import type { PrismaClient } from '@prisma/client'

declare global {
  // Extend the db export to include wallet model
  var db: PrismaClient & {
    wallet: any
  }
}

export {}
