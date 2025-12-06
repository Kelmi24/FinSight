-- Baseline core tables to allow shadow database creation when history is missing
CREATE TABLE IF NOT EXISTS "User" (
	"id" TEXT NOT NULL,
	"name" TEXT,
	"email" TEXT,
	"emailVerified" TIMESTAMPTZ,
	"image" TEXT,
	"password" TEXT,
	"currencyPreference" TEXT NOT NULL DEFAULT 'IDR',
	"resetToken" TEXT,
	"resetTokenExpiry" TIMESTAMPTZ,
	"plaidAccessToken" TEXT,
	"plaidItemId" TEXT,
	"institutionName" TEXT,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "User_email_key" UNIQUE ("email"),
	CONSTRAINT "User_resetToken_key" UNIQUE ("resetToken")
);

CREATE TABLE IF NOT EXISTS "Account" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"provider" TEXT NOT NULL,
	"providerAccountId" TEXT NOT NULL,
	"refresh_token" TEXT,
	"access_token" TEXT,
	"expires_at" INTEGER,
	"token_type" TEXT,
	"scope" TEXT,
	"id_token" TEXT,
	"session_state" TEXT,
	CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider","providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
	"id" TEXT NOT NULL,
	"sessionToken" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL,
	CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Session_sessionToken_key" UNIQUE ("sessionToken")
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
	"identifier" TEXT NOT NULL,
	"token" TEXT NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL,
	CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token"),
	CONSTRAINT "VerificationToken_token_key" UNIQUE ("token")
);

CREATE TABLE IF NOT EXISTS "Transaction" (
	"id" TEXT NOT NULL,
	"amount" DOUBLE PRECISION NOT NULL,
	"currency" TEXT NOT NULL DEFAULT 'USD',
	"description" TEXT NOT NULL,
	"category" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"type" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Budget" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"category" TEXT NOT NULL,
	"amount" DOUBLE PRECISION NOT NULL,
	"currency" TEXT NOT NULL DEFAULT 'USD',
	"period" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Goal" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"targetAmount" DOUBLE PRECISION NOT NULL,
	"currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
	"currency" TEXT NOT NULL DEFAULT 'USD',
	"deadline" TIMESTAMPTZ,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Category" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"color" TEXT,
	"icon" TEXT,
	"isDefault" BOOLEAN NOT NULL DEFAULT false,
	"userId" TEXT NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Ensure table exists for both shadow and real databases
CREATE TABLE IF NOT EXISTS "RecurringTransaction" (
		"id" TEXT NOT NULL,
		"name" TEXT,
		"notes" TEXT,
		"amount" DOUBLE PRECISION NOT NULL,
		"currency" TEXT NOT NULL DEFAULT 'USD',
		"description" TEXT NOT NULL,
		"category" TEXT NOT NULL,
		"type" TEXT NOT NULL,
		"frequency" TEXT NOT NULL,
		"startDate" TIMESTAMPTZ NOT NULL,
		"endDate" TIMESTAMPTZ,
		"lastGenerated" TIMESTAMPTZ,
		"nextDueDate" TIMESTAMPTZ,
		"lastConfirmedAt" TIMESTAMPTZ,
		"status" TEXT NOT NULL DEFAULT 'pending',
		"reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
		"userId" TEXT NOT NULL,
		"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
		"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
		CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("id")
);

-- Add columns if missing (idempotent)
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "nextDueDate" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "lastConfirmedAt" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "reminderEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "lastGenerated" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "amount" DOUBLE PRECISION;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "type" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "frequency" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMPTZ;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "RecurringTransaction" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Initialize nextDueDate for existing rows
UPDATE "RecurringTransaction" SET "nextDueDate" = COALESCE("lastGenerated", "startDate", NOW()) WHERE "nextDueDate" IS NULL;

-- Ensure nextDueDate is not null going forward
ALTER TABLE "RecurringTransaction" ALTER COLUMN "nextDueDate" SET NOT NULL;

-- Foreign key
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'RecurringTransaction_userId_fkey'
	) THEN
		ALTER TABLE "RecurringTransaction"
			ADD CONSTRAINT "RecurringTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
END$$;

-- Add missing foreign keys for other tables
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'Account_userId_fkey'
	) THEN
		ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'Session_userId_fkey'
	) THEN
		ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'Transaction_userId_fkey'
	) THEN
		ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'Budget_userId_fkey'
	) THEN
		ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'Goal_userId_fkey'
	) THEN
		ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'Category_userId_fkey'
	) THEN
		ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
	END IF;
END$$;
