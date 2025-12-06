-- Add to-do style fields to recurring transactions
ALTER TABLE "RecurringTransaction" ADD COLUMN "name" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN "notes" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN "nextDueDate" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN "lastConfirmedAt" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "RecurringTransaction" ADD COLUMN "reminderEnabled" BOOLEAN NOT NULL DEFAULT false;

-- Initialize nextDueDate for existing rows
UPDATE "RecurringTransaction" SET "nextDueDate" = COALESCE("lastGenerated", "startDate", NOW()) WHERE "nextDueDate" IS NULL;

-- Ensure nextDueDate is not null going forward
ALTER TABLE "RecurringTransaction" ALTER COLUMN "nextDueDate" SET NOT NULL;
