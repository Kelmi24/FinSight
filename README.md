# FinSight AI

A personal financial management platform built with Next.js 14, featuring transaction tracking, budget management, goal setting, and analytics with multi-currency support.

## Features

- Transaction management with CSV import support for Indonesian banks
- Budget tracking with category-based spending limits
- Financial goal setting and progress monitoring
- Interactive dashboard with charts and analytics
- Multi-currency support with real-time conversion
- Authentication via credentials or Google OAuth
- Dark mode support
- Responsive design

## Tech Stack

- Next.js 14 with App Router and Server Actions
- TypeScript
- PostgreSQL with Prisma ORM
- NextAuth v5
- Tailwind CSS
- Radix UI components
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

Clone and install dependencies:

```bash
git clone https://github.com/Kelmi24/FinSight.git
cd FinSight
npm install
```

Set up environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finsight"

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
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

Run database migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts and preferences
- **Transaction**: Financial transactions with multi-currency support
- **Budget**: Category-based spending limits
- **Goal**: Financial savings goals
- **Category**: Transaction categories
- **RecurringTransaction**: Automated recurring transactions
- **Wallet**: Multiple wallet support

## CSV Import

Supports importing transactions from Indonesian banks (BCA, Mandiri, BNI, BRI) and custom CSV formats. The import wizard includes format detection, data preview, and validation.

## Deployment

Deploy to Vercel:

```bash
git push origin main
```

Set environment variables in Vercel dashboard and run migrations in production:

```bash
npx prisma migrate deploy
```

## License

This project is private and proprietary.

---

Built with Next.js, TypeScript, and Tailwind CSS
