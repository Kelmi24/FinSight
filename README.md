# FinSight AI

> **AI-Powered Personal Financial Coach & Visualizer**

A modern, full-stack financial management platform built with Next.js 14, featuring intelligent transaction tracking, budget management, goal setting, and comprehensive analytics. Designed with multi-currency support and Indonesian bank integration.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

### 🏦 **Transaction Management**
- **CSV Import**: Bulk import transactions from bank statements (BCA, Mandiri, BNI, BRI, and custom formats)
- **Smart Category Detection**: Automatic categorization based on Indonesian bank transaction descriptions
- **Multi-select Batch Operations**: Delete multiple transactions at once with checkboxes
- **Advanced Filtering**: Filter by date range, category, type, and amount
- **Recurring Transactions**: Set up automatic recurring income/expenses (weekly, monthly, yearly)

### 📊 **Dashboard & Analytics**
- **Unified Dashboard**: Real-time KPI cards (income, expenses, savings, transaction count)
- **Interactive Charts**: Cash flow trends, category breakdowns, month-over-month comparisons
- **Recent Transactions**: Quick view of latest financial activity
- **Global Filters**: Persistent filter state across dashboard and analytics views
- **Data Export**: Download analytics data as CSV for external analysis

### 💰 **Budget Management**
- **Category-based Budgets**: Set spending limits per category (monthly/yearly)
- **Progress Tracking**: Visual progress bars with real-time spending updates
- **Smart Alerts**: Yellow warning at 80% usage, red alert when over budget
- **Multi-currency Support**: Create budgets in 11+ currencies (IDR, USD, EUR, SGD, etc.)

### 🎯 **Goal Setting**
- **Savings Goals**: Track progress toward financial targets
- **Visual Progress**: Progress bars and percentage completion
- **Target Dates**: Set deadlines and monitor time remaining
- **Current Balance Tracking**: Update and visualize your journey to goals

### 🔐 **Authentication & Security**
- **NextAuth v5**: Secure authentication with Credentials and Google OAuth
- **Password Reset**: Email-based password recovery flow
- **Session Management**: Persistent user sessions with Prisma adapter
- **Protected Routes**: Middleware-based route protection

### 🎨 **User Experience**
- **Dark Mode**: Toggle between light and dark themes (next-themes)
- **Responsive Design**: Mobile-first design with tablet and desktop breakpoints
- **Accessible UI**: Built with Radix UI primitives for accessibility
- **Toast Notifications**: User-friendly feedback with Sonner
- **Smooth Animations**: Framer Motion for polished interactions

### 💱 **Multi-Currency System**
- **11 Supported Currencies**: IDR, USD, EUR, GBP, JPY, CAD, AUD, SGD, MYR, THB, INR
- **Real-time Conversion**: Display amounts in user's preferred currency
- **Exchange Rate Matrix**: Static rates (configurable for live API integration)
- **Per-transaction Currency**: Store original currency for each transaction

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router, Server Actions, Server Components)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0 + Custom Design Tokens
- **UI Components**: Radix UI (Dialog, Select, Popover, Calendar)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand (filter state), React Context (currency, theme)
- **Forms**: React Hook Form patterns with Server Actions
- **Charts**: Recharts (bar, line, pie charts)

### **Backend**
- **Runtime**: Node.js (Next.js API Routes & Server Actions)
- **Database**: PostgreSQL (via Prisma ORM)
- **ORM**: Prisma 5.22 (type-safe database queries)
- **Authentication**: NextAuth v5 (Credentials + Google OAuth)
- **Password Hashing**: bcryptjs
- **Session Storage**: Database sessions (Prisma adapter)

### **Data Processing**
- **CSV Parsing**: papaparse (bank statement imports)
- **Date Utilities**: date-fns (formatting, manipulation)
- **Indonesian Bank Support**: Custom parsers for BCA, Mandiri, BNI, BRI formats

### **Development Tools**
- **Linting**: ESLint (Next.js config)
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest (unit tests for exchange rates)
- **Database Migrations**: Prisma Migrate

---

## 📁 Project Structure

```
finsight-ai/
├── prisma/
│   ├── schema.prisma              # Database schema (User, Transaction, Budget, Goal, Category)
│   └── migrations/                # Database migration history
├── public/
│   └── sample-*.csv               # Sample CSV files for testing imports
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── (auth)/                # Authentication routes (login, register, reset)
│   │   ├── (dashboard)/           # Protected dashboard routes
│   │   │   ├── dashboard/         # Main dashboard with analytics
│   │   │   ├── transactions/      # Transaction list with filters
│   │   │   ├── budgets/           # Budget management
│   │   │   ├── goals/             # Goal tracking
│   │   │   └── settings/          # User settings
│   │   ├── api/auth/              # NextAuth API routes
│   │   ├── seed/                  # Development data seeding
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles + design tokens
│   ├── components/
│   │   ├── analytics/             # Chart and analytics components
│   │   ├── auth/                  # Login, register, password reset forms
│   │   ├── budgets/               # Budget list, form, dialogs
│   │   ├── categories/            # Category select, dialog, CRUD
│   │   ├── dashboard/             # Dashboard-specific components
│   │   ├── goals/                 # Goal cards, forms, dialogs
│   │   ├── layout/                # Navbar, sidebar, footer, theme toggle
│   │   ├── plaid/                 # Bank connection (mock Plaid integration)
│   │   ├── settings/              # Settings sections (profile, security, data)
│   │   ├── transactions/          # Transaction list, forms, import, recurring
│   │   └── ui/                    # Reusable UI primitives (button, dialog, select, etc.)
│   ├── lib/
│   │   ├── actions/               # Server Actions (CRUD operations)
│   │   │   ├── analytics.ts       # Analytics queries
│   │   │   ├── auth.ts            # Authentication actions
│   │   │   ├── budgets.ts         # Budget CRUD
│   │   │   ├── categories.ts      # Category CRUD
│   │   │   ├── dashboard.ts       # Dashboard data fetching
│   │   │   ├── goals.ts           # Goal CRUD
│   │   │   ├── plaid-mock.ts      # Mock bank linking
│   │   │   ├── recurring.ts       # Recurring transaction CRUD
│   │   │   ├── settings.ts        # Data export, bulk delete
│   │   │   ├── transactions.ts    # Transaction CRUD, bulk import
│   │   │   └── user.ts            # User profile updates
│   │   ├── parsers/               # File parsing utilities
│   │   │   ├── csvParser.ts       # CSV parsing with bank format detection
│   │   │   ├── dateParser.ts      # Indonesian date format parsing
│   │   │   ├── amountParser.ts    # Indonesian number format parsing
│   │   │   └── indonesian/        # Indonesian bank-specific parsers
│   │   ├── services/              # Business logic services
│   │   │   └── analyticsService.ts # Analytics data aggregation
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── utils.ts               # Utility functions (cn, clsx)
│   │   ├── currency.ts            # Currency formatting and configuration
│   │   ├── exchange-rates.ts      # Currency conversion logic
│   │   └── filterUtils.ts         # Filter state utilities
│   ├── providers/
│   │   ├── currency-provider.tsx  # Currency context provider
│   │   └── filter-provider.tsx    # Global filter state provider
│   ├── types/                     # TypeScript type definitions
│   ├── auth.ts                    # NextAuth configuration
│   └── middleware.ts              # Route protection middleware
├── .env                           # Environment variables
├── .env.local                     # Local environment overrides
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.mjs                # Next.js configuration
└── README.md                      # This file
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js**: v18.0 or higher
- **PostgreSQL**: v14 or higher (or use a cloud provider like Supabase, Neon, PlanetScale)
- **npm**: v9.0 or higher (comes with Node.js)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kelmi24/FinSight.git
   cd FinSight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/finsight"

   # NextAuth
   AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (Optional)
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npx prisma migrate deploy

   # Or push schema directly (for development)
   npx prisma db push

   # Generate Prisma Client
   npx prisma generate
   ```

5. **Seed the database (optional)**
   ```bash
   # Start dev server
   npm run dev

   # Visit http://localhost:3000/seed and click "Seed Sample Transactions"
   # This creates a demo user with 8 sample transactions
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | - |
| `AUTH_SECRET` | Secret key for session encryption | ✅ Yes | - |
| `NEXTAUTH_URL` | Base URL of your application | ✅ Yes | `http://localhost:3000` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | ❌ No | - |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | ❌ No | - |

### **Generating AUTH_SECRET**

```bash
openssl rand -base64 32
```

### **Setting up Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

---

## 🏃 Running the Project

### **Development Mode**
```bash
npm run dev
```
Starts the dev server at [http://localhost:3000](http://localhost:3000)

### **Production Build**
```bash
npm run build
npm start
```

### **Database Commands**
```bash
# Push schema changes to database (no migration)
npm run db:push

# Run pending migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### **Linting**
```bash
npm run lint
```

---

## 📦 Database Schema

### **Core Models**

- **User**: Authentication and profile data
  - Fields: `id`, `name`, `email`, `password`, `image`, `currencyPreference`, `institutionName`
  - Relations: `transactions`, `budgets`, `goals`, `categories`, `recurringTransactions`

- **Transaction**: Financial transactions
  - Fields: `id`, `date`, `description`, `amount`, `type`, `category`, `currency`
  - Relations: `user`, `recurringTransaction`

- **Budget**: Spending budgets
  - Fields: `id`, `category`, `amount`, `period`, `currency`
  - Relations: `user`

- **Goal**: Savings goals
  - Fields: `id`, `name`, `targetAmount`, `currentAmount`, `targetDate`, `currency`
  - Relations: `user`

- **Category**: Custom transaction categories
  - Fields: `id`, `name`, `type`, `color`, `icon`, `isDefault`
  - Relations: `user`

- **RecurringTransaction**: Automated recurring transactions
  - Fields: `id`, `description`, `amount`, `type`, `category`, `frequency`, `startDate`, `endDate`
  - Relations: `user`, `transactions`

### **NextAuth Models**
- **Account**: OAuth account data
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

---

## 🎨 Design System

### **Colors**
- **Primary**: Indigo/Blue (`#4F46E5`) - Main brand color
- **Success**: Green (`#10B981`) - Positive actions, income
- **Destructive**: Red (`#EF4444`) - Errors, expenses, deletions
- **Warning**: Yellow (`#F59E0B`) - Alerts, warnings
- **Muted**: Gray (`#6B7280`) - Secondary text, borders

### **Typography**
- **Sans**: Inter, system fonts
- **Mono**: JetBrains Mono, Fira Code

### **Components**
All UI components follow shadcn/ui design patterns with custom styling:
- Buttons: 5 variants (default, destructive, outline, secondary, ghost)
- Dialogs: Centered modals with backdrop
- Forms: Consistent input styling with focus states
- Cards: Elevated containers with hover effects

---

## 🔒 Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: Credentials or Google OAuth
3. **Session**: NextAuth manages sessions in database
4. **Protected Routes**: Middleware checks authentication for `/dashboard/*` routes
5. **Password Reset**: Email-based token flow (console log in development)

---

## 💾 Data Import

### **Supported Bank Formats**

| Bank | Format | Columns |
|------|--------|---------|
| **BCA** | CSV | Tanggal, Keterangan, CBG, Mutasi, Saldo |
| **Mandiri** | CSV | Tanggal Transaksi, Keterangan, Jenis, Jumlah (IDR), Saldo |
| **BNI** | CSV | TGL, URAIAN, DEBIT, KREDIT, SALDO |
| **BRI** | CSV | Tanggal, Deskripsi, Nominal, Jenis, Saldo |
| **Custom** | CSV | Date, Description, Amount (or Debit/Credit columns) |

### **Import Features**
- Auto-detection of bank format
- Preview and edit before import
- Category suggestions based on description
- Date format parsing (DD/MM/YYYY, Indonesian formats)
- Amount parsing (IDR format: 1.234.567,89)
- Bulk validation with error reporting

### **Sample Files**
Test the import feature with sample CSV files in `/public/`:
- `sample-bca.csv`
- `sample-mandiri.csv`
- `sample-bni.csv`
- `sample-bri.csv`

---

## 🧪 Testing

### **Manual Testing Checklist**

✅ **Authentication**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Login with Google OAuth
- [ ] Password reset flow
- [ ] Logout

✅ **Transactions**
- [ ] Create manual transaction
- [ ] Import CSV file
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Batch delete with checkboxes
- [ ] Filter by date, category, type

✅ **Budgets**
- [ ] Create budget
- [ ] View budget progress
- [ ] Edit budget
- [ ] Delete budget
- [ ] Alert badges (80%, 100%+)

✅ **Goals**
- [ ] Create goal
- [ ] Update progress
- [ ] Edit goal
- [ ] Delete goal

✅ **Dashboard**
- [ ] View KPI cards
- [ ] View charts (cash flow, category breakdown)
- [ ] Apply filters
- [ ] Filter persistence across routes

✅ **Settings**
- [ ] Update profile
- [ ] Change currency preference
- [ ] Toggle dark mode
- [ ] Export data
- [ ] Delete all data

### **Unit Tests**

Run exchange rate tests:
```bash
npm test
```

---

## 🚢 Deployment

### **Vercel (Recommended)**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set Environment Variables**
   - Add all variables from `.env` to Vercel dashboard
   - Update `NEXTAUTH_URL` to your production domain

4. **Set Up Database**
   - Use Vercel Postgres, Supabase, or Neon
   - Update `DATABASE_URL` in Vercel
   - Run migrations: `npx prisma migrate deploy`

5. **Deploy**
   - Vercel automatically deploys on push to main

### **Manual Deployment**

```bash
# Build for production
npm run build

# Run migrations
npx prisma migrate deploy

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Code Style**
- Use TypeScript for all new code
- Follow existing naming conventions (PascalCase for components, camelCase for functions)
- Add JSDoc comments for complex functions
- Use Server Actions for mutations, Server Components for data fetching
- Keep components focused and reusable

### **Commit Messages**
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- **Next.js** - The React Framework for Production
- **Prisma** - Next-generation ORM
- **Radix UI** - Unstyled, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Design system inspiration
- **Recharts** - Composable charting library
- **NextAuth** - Authentication for Next.js

---

## 📞 Support

For questions or issues:
- **GitHub Issues**: [Create an issue](https://github.com/Kelmi24/FinSight/issues)
- **Email**: rickelme@example.com

---

## 🗺️ Roadmap

### **Planned Features**
- [ ] Mobile app (React Native)
- [ ] Email notifications for budget alerts
- [ ] Automated recurring transaction generation (cron job)
- [ ] Live exchange rate API integration
- [ ] Real Plaid API integration
- [ ] Multi-account support
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Financial insights with AI

### **Known Issues**
- Password reset emails not sent (development: check console logs)
- Recurring transactions must be manually generated (no auto-generation yet)

---

**Built with ❤️ by Kelmi24**
