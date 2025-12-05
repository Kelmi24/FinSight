# CopperX Component Mapping Document

## Phase 2 Deliverable - Component-to-Component Mapping

---

## Theming Approach

### Strategy: CSS Variables + Tailwind Theme Extension

1. **Primary Method**: CSS custom properties (`:root` variables) for runtime theming
2. **Integration**: Extend Tailwind config to consume CSS variables
3. **Dark Mode**: `.dark` class toggle with variable overrides
4. **Component Overrides**: Direct Tailwind class updates in component files

### Token Naming Convention

```
--cx-{category}-{property}-{variant}

Examples:
--cx-color-primary-500
--cx-color-bg-page
--cx-spacing-md
--cx-radius-lg
--cx-shadow-card
```

---

## Component Mapping Table

### Layout Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| Navbar | `src/components/layout/Navbar.tsx` | Top header bar | Remove gradient, white bg, simpler logo, right-aligned user menu with balance indicator |
| Sidebar | `src/components/layout/Sidebar.tsx` | Left sidebar | White bg, remove gradient, add menu icons, active state = indigo bg/text, add promo card at bottom |
| Footer | `src/components/layout/Footer.tsx` | Footer | Minimal footer, copyright text |
| UserMenu | `src/components/layout/UserMenu.tsx` | User dropdown | Rounded avatar, chevron, cleaner dropdown styling |
| ThemeToggle | `src/components/layout/ThemeToggle.tsx` | Theme toggle | Keep but restyle to match system |

### UI Primitives

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| Button | `src/components/ui/button.tsx` | Button | Remove gradient, solid indigo-600, rounded-lg (8px), softer shadow, no scale on active |
| Input | `src/components/ui/input.tsx` | Input | Gray-300 border, rounded-lg (8px), indigo focus ring, 10px height, clean placeholder |
| Card | `src/components/ui/card.tsx` | Card | White bg, gray-200 border, rounded-xl (16px), subtle shadow, no hover transform |
| Dialog | `src/components/ui/dialog.tsx` | Modal | Rounded-xl, lighter overlay (50% opacity), X button top-right, max-w-md default |
| Select | `src/components/ui/select.tsx` | Select/Dropdown | Match input styling, rounded dropdown content, item hover states |
| Table | `src/components/ui/table.tsx` | Table | Light gray header, no uppercase, subtle row borders, hover highlight |
| Label | `src/components/ui/label.tsx` | Label | 14px medium weight, gray-700 color |
| Calendar | `src/components/ui/calendar.tsx` | Calendar | Match color scheme, indigo accent |
| DatePicker | `src/components/ui/date-picker.tsx` | Date Picker | Calendar styling + input trigger |
| Popover | `src/components/ui/popover.tsx` | Popover | Rounded-xl, shadow-lg, white bg |
| EmptyState | `src/components/ui/empty-state.tsx` | Empty State | Centered content, icon circle, CTA button |

### Auth Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| AuthCard | `src/components/auth/AuthCard.tsx` | Auth container | Centered card, dot pattern background, logo above card |
| LoginForm | `src/components/auth/LoginForm.tsx` | Login form | Google OAuth button, email input, divider, footer links |
| RegisterForm | `src/components/auth/RegisterForm.tsx` | Register form | Name fields, password, terms checkbox, cleaner layout |
| ForgotPasswordForm | `src/components/auth/ForgotPasswordForm.tsx` | Forgot password | Same structure, updated styling |
| ResetPasswordForm | `src/components/auth/ResetPasswordForm.tsx` | Reset password | Same structure, updated styling |
| DeleteAccountModal | `src/components/auth/DeleteAccountModal.tsx` | Delete modal | Destructive confirmation dialog |

### Dashboard Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| KpiCard | `src/components/dashboard/KpiCard.tsx` | Balance/Stats card | Remove gradient icon, cleaner layout, larger value text |
| CashFlowChart | `src/components/dashboard/CashFlowChart.tsx` | Charts | Match color scheme |
| CategoryChart | `src/components/dashboard/CategoryChart.tsx` | Charts | Match color scheme |
| RecentTransactions | `src/components/dashboard/RecentTransactions.tsx` | Transaction list | Tab filters, cleaner table, action icons |

### Transaction Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| TransactionList | `src/components/transactions/TransactionList.tsx` | Transaction table | Match table styling, row actions |
| TransactionDialog | `src/components/transactions/TransactionDialog.tsx` | Add/Edit modal | Form in modal, cleaner styling |
| TransactionForm | `src/components/transactions/TransactionForm.tsx` | Transaction form | Input styling, select styling |
| TransactionFilters | `src/components/transactions/TransactionFilters.tsx` | Filter controls | Inline filter chips/selects |
| TransactionTabs | `src/components/transactions/TransactionTabs.tsx` | Tab navigation | Underline active tab |
| RecurringList | `src/components/transactions/RecurringList.tsx` | Table | Same as transaction table |
| RecurringDialog | `src/components/transactions/RecurringDialog.tsx` | Modal | Same as transaction dialog |
| RecurringForm | `src/components/transactions/RecurringForm.tsx` | Form | Same as transaction form |

### Budget Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| BudgetList | `src/components/budgets/BudgetList.tsx` | Budget cards | Card grid, progress bars |
| BudgetDialog | `src/components/budgets/BudgetDialog.tsx` | Add/Edit modal | Form modal styling |
| BudgetForm | `src/components/budgets/BudgetForm.tsx` | Budget form | Input/select styling |
| BudgetPageHeader | `src/components/budgets/BudgetPageHeader.tsx` | Page header | Title + add button |

### Goal Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| GoalList | `src/components/goals/GoalList.tsx` | Goal cards | Card grid layout |
| GoalCard | `src/components/goals/GoalCard.tsx` | Goal card | Progress visualization |
| GoalDialog | `src/components/goals/GoalDialog.tsx` | Add/Edit modal | Form modal |
| GoalForm | `src/components/goals/GoalForm.tsx` | Goal form | Input styling |
| GoalPageHeader | `src/components/goals/GoalPageHeader.tsx` | Page header | Title + add button |

### Analytics Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| AnalyticsClient | `src/components/analytics/AnalyticsClient.tsx` | Analytics view | Chart + filter container |
| AnalyticsFilters | `src/components/analytics/AnalyticsFilters.tsx` | Filter controls | Inline filters |
| TrendChart | `src/components/analytics/TrendChart.tsx` | Line/Bar chart | Color scheme |
| TransactionTable | `src/components/analytics/TransactionTable.tsx` | Data table | Table styling |
| ExportButton | `src/components/analytics/ExportButton.tsx` | Export button | Button styling |
| MonthOverMonthComparison | `src/components/analytics/MonthOverMonthComparison.tsx` | Comparison view | Card + charts |

### Settings Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| ProfileSection | `src/components/settings/ProfileSection.tsx` | Profile settings | Form layout, avatar upload |
| AppearanceSection | `src/components/settings/AppearanceSection.tsx` | Appearance settings | Theme toggle |
| SecuritySection | `src/components/settings/SecuritySection.tsx` | Security settings | Password fields |
| AccountsSection | `src/components/settings/AccountsSection.tsx` | Accounts list | Connected accounts |
| DataManagementSection | `src/components/settings/DataManagementSection.tsx` | Data options | Export/delete buttons |

### Plaid/Bank Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| ConnectBankButton | `src/components/plaid/ConnectBankButton.tsx` | Connect button | Button styling |
| ConnectedAccount | `src/components/plaid/ConnectedAccount.tsx` | Account card | Card with bank info |

### Category Components

| Existing Component | File Path | CopperX Equivalent | Changes Required |
|-------------------|-----------|-------------------|------------------|
| CategoryList | `src/components/categories/CategoryList.tsx` | Category list | List styling |
| CategoryDialog | `src/components/categories/CategoryDialog.tsx` | Add/Edit modal | Modal styling |
| CategorySelect | `src/components/categories/CategorySelect.tsx` | Category dropdown | Select styling |

---

## Detailed Style Specifications

### Button Component Changes

```tsx
// Current (button.tsx)
"bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"

// Target (CopperX style)
"bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 rounded-lg"

// Full variant mapping:
default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
destructive: "bg-red-600 text-white hover:bg-red-700"
outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
ghost: "hover:bg-gray-100 text-gray-700"
link: "text-indigo-600 underline-offset-4 hover:underline"
```

### Input Component Changes

```tsx
// Current (input.tsx)
"border-2 border-gray-300 bg-white rounded-md focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200"

// Target (CopperX style)
"border border-gray-300 bg-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
```

### Card Component Changes

```tsx
// Current (card.tsx)
"bg-card rounded-lg border border-border p-6 shadow-sm transition-all hover:shadow-md"

// Target (CopperX style)
"bg-white rounded-xl border border-gray-200 p-6 shadow-sm" // Remove hover transform
```

### Sidebar Changes

```tsx
// Current active state:
"bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"

// Target (CopperX style):
"bg-indigo-50 text-indigo-600 font-medium"

// Current inactive:
"text-gray-600 hover:bg-white hover:text-blue-600"

// Target:
"text-gray-600 hover:bg-gray-50"
```

### Modal/Dialog Changes

```tsx
// Current overlay:
"bg-black/80"

// Target:
"bg-black/50"

// Current content:
"rounded-xl border-gray-200 shadow-xl"

// Target:
"rounded-2xl border-gray-200 shadow-2xl max-w-md"
```

---

## Global CSS Variable Mapping

### Root Variables to Add

```css
:root {
  /* CopperX Brand Colors */
  --cx-primary: 239 84% 67%; /* #6366F1 in HSL */
  --cx-primary-hover: 239 84% 60%;
  
  /* Backgrounds */
  --cx-bg-page: 210 20% 98%; /* #F9FAFB */
  --cx-bg-card: 0 0% 100%;
  --cx-bg-sidebar: 0 0% 100%;
  
  /* Text */
  --cx-text-primary: 220 13% 13%; /* #1F2937 */
  --cx-text-secondary: 215 14% 34%; /* #4B5563 */
  --cx-text-muted: 217 11% 45%; /* #6B7280 */
  
  /* Borders */
  --cx-border: 214 20% 90%; /* #E5E7EB */
  --cx-border-input: 214 20% 85%; /* #D1D5DB */
  
  /* Radii */
  --cx-radius-sm: 0.25rem;
  --cx-radius-md: 0.5rem;
  --cx-radius-lg: 0.75rem;
  --cx-radius-xl: 1rem;
  --cx-radius-2xl: 1.5rem;
  
  /* Shadows */
  --cx-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --cx-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --cx-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --cx-shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

## Files Requiring Changes (Complete List)

### High Priority (Core Theming)
1. `src/app/globals.css` - Update CSS variables
2. `tailwind.config.ts` - Extend theme with CopperX tokens
3. `src/components/ui/button.tsx` - Button variants
4. `src/components/ui/input.tsx` - Input styling
5. `src/components/ui/card.tsx` - Card styling
6. `src/components/ui/dialog.tsx` - Modal styling
7. `src/components/layout/Navbar.tsx` - Header redesign
8. `src/components/layout/Sidebar.tsx` - Sidebar redesign

### Medium Priority (Component Updates)
9. `src/components/ui/select.tsx` - Select/dropdown
10. `src/components/ui/table.tsx` - Table styling
11. `src/components/ui/label.tsx` - Label styling
12. `src/components/ui/popover.tsx` - Popover styling
13. `src/components/ui/calendar.tsx` - Calendar theming
14. `src/components/ui/date-picker.tsx` - Date picker
15. `src/components/ui/empty-state.tsx` - Empty state
16. `src/components/layout/UserMenu.tsx` - User menu
17. `src/components/layout/Footer.tsx` - Footer

### Auth Pages
18. `src/components/auth/AuthCard.tsx` - Auth container
19. `src/components/auth/LoginForm.tsx` - Login form
20. `src/components/auth/RegisterForm.tsx` - Register form
21. `src/components/auth/ForgotPasswordForm.tsx` - Password reset
22. `src/components/auth/ResetPasswordForm.tsx` - Reset form
23. `src/components/auth/DeleteAccountModal.tsx` - Delete modal

### Dashboard
24. `src/components/dashboard/KpiCard.tsx` - Stats cards
25. `src/components/dashboard/CashFlowChart.tsx` - Charts
26. `src/components/dashboard/CategoryChart.tsx` - Charts
27. `src/components/dashboard/RecentTransactions.tsx` - Transaction list

### Feature Components
28. `src/components/transactions/TransactionList.tsx`
29. `src/components/transactions/TransactionDialog.tsx`
30. `src/components/transactions/TransactionForm.tsx`
31. `src/components/transactions/TransactionFilters.tsx`
32. `src/components/transactions/TransactionTabs.tsx`
33. `src/components/budgets/BudgetList.tsx`
34. `src/components/budgets/BudgetDialog.tsx`
35. `src/components/goals/GoalList.tsx`
36. `src/components/goals/GoalCard.tsx`
37. `src/components/goals/GoalDialog.tsx`
38. `src/components/analytics/AnalyticsClient.tsx`
39. `src/components/analytics/TrendChart.tsx`

### Settings
40. `src/components/settings/ProfileSection.tsx`
41. `src/components/settings/AppearanceSection.tsx`
42. `src/components/settings/SecuritySection.tsx`
43. `src/components/settings/AccountsSection.tsx`
44. `src/components/settings/DataManagementSection.tsx`

### Layout Pages
45. `src/app/(dashboard)/layout.tsx` - Dashboard layout
46. `src/app/(dashboard)/page.tsx` - Dashboard page
47. `src/app/(auth)/login/page.tsx` - Login page
48. `src/app/(auth)/register/page.tsx` - Register page

### Assets
49. `public/` - Add CopperX-style logo SVG
50. `src/components/layout/Navbar.tsx` - Update logo reference

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

### Mobile Considerations
- Sidebar hidden on mobile, hamburger menu
- Cards stack vertically
- Tables scroll horizontally
- Modals full-width on mobile
- Reduced padding on small screens
