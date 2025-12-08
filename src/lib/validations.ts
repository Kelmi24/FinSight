import { z } from 'zod'

/**
 * Validation schema for transaction creation/update
 * Ensures data integrity and prevents invalid inputs
 */
export const transactionSchema = z.object({
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .multipleOf(0.01, "Amount can have at most 2 decimal places")
    .max(999999999.99, "Amount is too large"),
  
  currency: z
    .string()
    .min(3, "Currency code must be at least 3 characters")
    .max(3, "Currency code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency must be a valid 3-letter code (e.g., USD, IDR)")
    .default("USD"),
  
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be less than 255 characters")
    .trim(),
  
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category name is too long"),
  
  type: z
    .enum(["income", "expense", "transfer"])
    .default("expense"),
  
  date: z
    .coerce.date()
    .max(new Date(), "Date cannot be in the future"),
  
  walletId: z.string().optional(),
})

/**
 * Schema for budget creation/update
 */
export const budgetSchema = z.object({
  amount: z
    .number()
    .positive("Budget amount must be greater than 0")
    .multipleOf(0.01, "Amount can have at most 2 decimal places")
    .max(999999999.99, "Amount is too large"),
  
  currency: z
    .string()
    .length(3, "Currency code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency must be a valid 3-letter code")
    .default("USD"),
  
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category name is too long"),
  
  period: z
    .enum(["weekly", "monthly", "yearly"])
    .default("monthly"),
})

/**
 * Schema for goal creation/update
 */
export const goalSchema = z.object({
  name: z
    .string()
    .min(1, "Goal name is required")
    .max(100, "Goal name is too long")
    .trim(),
  
  targetAmount: z
    .number()
    .positive("Target amount must be greater than 0")
    .multipleOf(0.01, "Amount can have at most 2 decimal places")
    .max(999999999.99, "Amount is too large"),
  
  currentAmount: z
    .number()
    .nonnegative("Current amount cannot be negative")
    .multipleOf(0.01, "Amount can have at most 2 decimal places")
    .default(0),
  
  currency: z
    .string()
    .length(3, "Currency code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency must be a valid 3-letter code")
    .default("USD"),
  
  deadline: z
    .date()
    .min(new Date(), "Deadline must be in the future")
    .optional(),
})

/**
 * Schema for recurring transaction
 */
export const recurringTransactionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .trim()
    .optional(),
  
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .multipleOf(0.01, "Amount can have at most 2 decimal places")
    .max(999999999.99, "Amount is too large"),
  
  currency: z
    .string()
    .length(3, "Currency code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency must be a valid 3-letter code")
    .default("USD"),
  
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be less than 255 characters")
    .trim(),
  
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category name is too long"),
  
  type: z
    .enum(["income", "expense"]),
  
  frequency: z
    .enum(["weekly", "monthly", "yearly"]),
  
  startDate: z
    .coerce.date(),
  
  endDate: z
    .date()
    .optional(),
  
  notes: z
    .string()
    .max(500, "Notes are too long")
    .optional(),
  
  walletId: z.string().optional(),
}).refine(
  (data) => !data.endDate || data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
)

/**
 * Schema for user profile update
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long")
    .trim(),
  
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email is too long"),
})

/**
 * Schema for password change
 */
export const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
  
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
)

/**
 * Schema for category creation/update
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name is too long")
    .trim(),
  
  type: z
    .enum(["income", "expense", "both"]),
  
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex code")
    .optional(),
  
  icon: z
    .string()
    .max(20, "Icon name is too long")
    .optional(),
})

/**
 * Schema for wallet creation/update
 */
export const walletSchema = z.object({
  name: z
    .string()
    .min(1, "Wallet name is required")
    .max(100, "Wallet name is too long")
    .trim(),
  
  type: z
    .enum(["bank", "cash", "ewallet", "investment", "other"]),
  
  currency: z
    .string()
    .length(3, "Currency code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency must be a valid 3-letter code")
    .default("USD"),
  
  balance: z
    .number()
    .multipleOf(0.01, "Balance can have at most 2 decimal places")
    .default(0),
  
  icon: z
    .string()
    .max(10, "Icon is invalid")
    .optional(),
  
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex code")
    .optional(),
})

// Type exports for use in components
export type TransactionInput = z.infer<typeof transactionSchema>
export type BudgetInput = z.infer<typeof budgetSchema>
export type GoalInput = z.infer<typeof goalSchema>
export type RecurringTransactionInput = z.infer<typeof recurringTransactionSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type PasswordInput = z.infer<typeof passwordSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type WalletInput = z.infer<typeof walletSchema>
