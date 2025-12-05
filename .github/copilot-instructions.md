# AI Coding Agent Instructions for FinSight AI

## Project Overview
**FinSight AI** is a Next.js 14 full-stack financial coach app with Prisma ORM (SQLite), NextAuth v5 authentication, and Plaid bank integration (mock). The app tracks transactions, budgets, goals, and provides analytics.

## Tech Stack
- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, Server Actions (`"use server"`)
- **Database**: Prisma ORM with SQLite (`dev.db`)
- **Auth**: NextAuth v5 with Prisma adapter
- **UI Components**: Custom shadcn-inspired components in `src/components/ui/`

## Critical Project Structure
```
src/
  app/                          # Next.js 14 app router
    page.tsx                    # Auth login page
    dashboard/page.tsx          # Main dashboard (connected accounts, recent txns)
    transactions/page.tsx       # Full transaction list with filters
    analytics/page.tsx          # Charts, trends, exports
    goals/page.tsx              # Goal management
    settings/page.tsx           # User profile, appearance, data management
    api/auth/[...nextauth]/     # NextAuth routes
  components/                   # Reusable UI components
    ui/                         # Base components (Button, Dialog, Input, Table, etc.)
    dashboard/                  # Dashboard-specific (CashFlowChart, KpiCard, etc.)
    transactions/               # Transaction components
    plaid/                      # Bank connection (ConnectedAccount, ConnectBankButton)
    settings/                   # Settings sections
  lib/
    db.ts                       # Prisma client singleton
    utils.ts                    # clsx, cn utility
    actions/                    # Server Actions (must have "use server" at top)
      dashboard.ts              # Dashboard queries
      transactions.ts           # CRUD transactions
      goals.ts                  # CRUD goals
      plaid-mock.ts             # Mock Plaid linkage, sync, unlink
      settings.ts               # User, data export, bulk delete
prisma/schema.prisma            # Data models: User, Transaction, Budget, Goal
```

## Database & Prisma Patterns
- **Schema**: User (with Plaid fields: `plaidAccessToken`, `plaidItemId`, `institutionName`), Transaction, Budget, Goal, NextAuth models (Account, Session, VerificationToken)
- **Migrations**: Run `npx prisma migrate dev` locally; `npx prisma db push` for schema-only sync
- **Client**: Import `{ db }` from `@/lib/db` — it's a singleton exported as `export const db = new PrismaClient()`
- **Relations**: User → many Transactions, Budgets, Goals (cascade delete)

## Server Actions & Authentication
- All mutations use Server Actions in `src/lib/actions/` with `"use server"` at the top
- Get session in actions: `const session = await auth()`, check `session?.user?.id`
- Always revalidate paths after mutations: `revalidatePath("/dashboard")`, `revalidatePath("/transactions")`
- Mock fallback for development: `const userId = session?.user?.id || "mock-user-id"`

## Client Component Patterns
- Use `"use client"` at the top for interactive UI (forms, dialogs, buttons)
- Import custom Dialog from `@/components/ui/dialog`: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- Button variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`
- For deletion, show confirmation dialog (see `src/components/transactions/TransactionList.tsx`)

## Common Development Commands
```bash
# Start dev server (port 3000)
PORT=3000 npm run dev

# Build for production
npm run build

# Prisma database commands
npx prisma studio              # GUI database browser
npx prisma migrate dev         # Create & apply migration
npx prisma db push             # Push schema (dev)

# Lint
npm run lint
```

## Key Files to Reference
- **Authentication**: `src/auth.ts` (NextAuth config), `src/middleware.ts` (protected routes)
- **UI Dialog**: `src/components/ui/dialog.tsx` (centered modal with backdrop)
- **Button Styling**: `src/components/ui/button.tsx` (all variants and sizes)
- **Mock Plaid Actions**: `src/lib/actions/plaid-mock.ts` (linkMockAccount, syncMockTransactions, unlinkAccount)
- **Transaction Queries**: `src/lib/actions/transactions.ts` (CRUD, filtering)

## Development Notes
- Always add `"use client"` for interactive/state components
- Use Tailwind dark mode classes (`dark:bg-gray-900`, etc.) for theme support
- Format currency: `new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)`
- Format dates: `new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date))`
- Dialogs are centered using `fixed inset-0 m-auto`; import from `@/components/ui/dialog`
- All buttons show `hover:cursor-pointer` on hover
