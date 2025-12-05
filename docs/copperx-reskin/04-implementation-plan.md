# CopperX Reskin Implementation Plan

## Phase 3 Deliverable - Step-by-Step Implementation

---

## Pre-Implementation Checklist

- [ ] Review and approve Visual Inventory (01-visual-inventory.md)
- [ ] Review and approve Design Tokens (02-design-tokens.json)
- [ ] Review and approve Component Mapping (03-component-mapping.md)
- [ ] Ensure all dependencies are installed (Inter font, etc.)
- [ ] Create feature branch `feat/reskin-copperx`
- [ ] Set up visual regression baseline (screenshots)

---

## Implementation Phases

### Phase A: Foundation (Day 1)

#### Step 1: Create Feature Branch
```bash
git checkout -b feat/reskin-copperx
```

#### Step 2: Add Design Tokens CSS File
Create `src/styles/copperx-tokens.css` with all CSS custom properties.

**Files:**
- CREATE: `src/styles/copperx-tokens.css`
- MODIFY: `src/app/globals.css` (import tokens)

#### Step 3: Update Tailwind Configuration
Extend Tailwind theme to use new tokens.

**Files:**
- MODIFY: `tailwind.config.ts`

#### Step 4: Add Inter Font
Ensure Inter font is loaded via Google Fonts or local files.

**Files:**
- MODIFY: `src/app/layout.tsx` (add font import)

---

### Phase B: Global Styles (Day 1-2)

#### Step 5: Update Base Styles
Update body background, default text colors, link styles.

**Files:**
- MODIFY: `src/app/globals.css`

#### Step 6: Update Dashboard Layout
Change main layout background and structure.

**Files:**
- MODIFY: `src/app/(dashboard)/layout.tsx`

---

### Phase C: Core UI Components (Day 2-3)

#### Step 7: Button Component
Update all button variants to match CopperX style.

**Files:**
- MODIFY: `src/components/ui/button.tsx`

**Changes:**
- Remove gradient backgrounds
- Use solid indigo-600 for primary
- Update border radius to rounded-lg
- Softer shadows
- Remove active scale effect

#### Step 8: Input Component
Update input styling to match CopperX.

**Files:**
- MODIFY: `src/components/ui/input.tsx`

**Changes:**
- Single border (not border-2)
- Gray-300 default border
- Indigo focus states
- Rounded-lg corners

#### Step 9: Card Component
Update card styling.

**Files:**
- MODIFY: `src/components/ui/card.tsx`

**Changes:**
- Rounded-xl (16px)
- Remove hover transform
- Subtle gray-200 border
- Consistent padding

#### Step 10: Label Component
Update label styling.

**Files:**
- MODIFY: `src/components/ui/label.tsx`

**Changes:**
- 14px font size
- Medium weight (500)
- Gray-700 color

#### Step 11: Select Component
Update select/dropdown styling.

**Files:**
- MODIFY: `src/components/ui/select.tsx`

**Changes:**
- Match input styling
- Rounded-xl dropdown content
- Indigo focus states
- Improved item hover states

#### Step 12: Table Component
Update table styling.

**Files:**
- MODIFY: `src/components/ui/table.tsx`

**Changes:**
- Light gray-50 header background
- Remove uppercase from headers
- Subtle row borders
- Improved hover states

#### Step 13: Dialog Component
Update modal styling.

**Files:**
- MODIFY: `src/components/ui/dialog.tsx`

**Changes:**
- 50% opacity overlay (not 80%)
- Rounded-2xl corners
- Max-width adjustments
- X button positioning

#### Step 14: Popover Component
Update popover styling.

**Files:**
- MODIFY: `src/components/ui/popover.tsx`

**Changes:**
- Rounded-xl corners
- Enhanced shadow
- White background

#### Step 15: Calendar/DatePicker
Update calendar styling.

**Files:**
- MODIFY: `src/components/ui/calendar.tsx`
- MODIFY: `src/components/ui/date-picker.tsx`

**Changes:**
- Indigo accent colors
- Rounded corners
- Match input trigger style

#### Step 16: Empty State
Update empty state styling.

**Files:**
- MODIFY: `src/components/ui/empty-state.tsx`

**Changes:**
- Cleaner icon circle
- Consistent spacing
- Match button styling

---

### Phase D: Layout Components (Day 3-4)

#### Step 17: Navbar Component
Redesign header/navbar.

**Files:**
- MODIFY: `src/components/layout/Navbar.tsx`

**Changes:**
- Remove gradient background
- White background with subtle border
- Simpler logo presentation
- Right-aligned balance indicator (optional)
- Clean user menu trigger

#### Step 18: Sidebar Component
Redesign sidebar navigation.

**Files:**
- MODIFY: `src/components/layout/Sidebar.tsx`

**Changes:**
- White background (remove gradient)
- Indigo-50 active state with indigo-600 text
- Icon + label layout for menu items
- Add "Invite and Earn" promo card (optional)
- Subtle hover states

#### Step 19: UserMenu Component
Update user dropdown menu.

**Files:**
- MODIFY: `src/components/layout/UserMenu.tsx`

**Changes:**
- Rounded avatar
- Chevron indicator
- Clean dropdown styling
- Improved user info header

#### Step 20: Footer Component
Update footer styling.

**Files:**
- MODIFY: `src/components/layout/Footer.tsx`

**Changes:**
- Minimal design
- Match color scheme

#### Step 21: ThemeToggle Component
Update theme toggle styling.

**Files:**
- MODIFY: `src/components/layout/ThemeToggle.tsx`

**Changes:**
- Match button/icon styling

---

### Phase E: Auth Components (Day 4)

#### Step 22: AuthCard Component
Update auth page container.

**Files:**
- MODIFY: `src/components/auth/AuthCard.tsx`

**Changes:**
- Centered card layout
- Optional dot pattern background
- Logo above card
- Consistent spacing

#### Step 23: LoginForm Component
Update login form styling.

**Files:**
- MODIFY: `src/components/auth/LoginForm.tsx`

**Changes:**
- OAuth button styling (Google)
- Divider with "OR" text
- Input styling
- Footer links

#### Step 24: RegisterForm Component
Update register form.

**Files:**
- MODIFY: `src/components/auth/RegisterForm.tsx`

**Changes:**
- Form field layout
- Terms checkbox styling
- Submit button styling

#### Step 25: Password Forms
Update forgot/reset password forms.

**Files:**
- MODIFY: `src/components/auth/ForgotPasswordForm.tsx`
- MODIFY: `src/components/auth/ResetPasswordForm.tsx`

#### Step 26: DeleteAccountModal
Update delete confirmation modal.

**Files:**
- MODIFY: `src/components/auth/DeleteAccountModal.tsx`

---

### Phase F: Dashboard Components (Day 5)

#### Step 27: KpiCard Component
Update stats/KPI cards.

**Files:**
- MODIFY: `src/components/dashboard/KpiCard.tsx`

**Changes:**
- Remove gradient icon background
- Cleaner layout
- Larger value text
- Simplified trend indicator

#### Step 28: Chart Components
Update chart styling.

**Files:**
- MODIFY: `src/components/dashboard/CashFlowChart.tsx`
- MODIFY: `src/components/dashboard/CategoryChart.tsx`

**Changes:**
- Indigo color scheme
- Match card container styling

#### Step 29: RecentTransactions
Update transaction list on dashboard.

**Files:**
- MODIFY: `src/components/dashboard/RecentTransactions.tsx`

**Changes:**
- Match table styling
- Tab filter styling
- Action buttons

---

### Phase G: Feature Components (Day 5-6)

#### Step 30: Transaction Components
Update all transaction-related components.

**Files:**
- MODIFY: `src/components/transactions/TransactionList.tsx`
- MODIFY: `src/components/transactions/TransactionDialog.tsx`
- MODIFY: `src/components/transactions/TransactionForm.tsx`
- MODIFY: `src/components/transactions/TransactionFilters.tsx`
- MODIFY: `src/components/transactions/TransactionTabs.tsx`
- MODIFY: `src/components/transactions/RecurringList.tsx`
- MODIFY: `src/components/transactions/RecurringDialog.tsx`
- MODIFY: `src/components/transactions/RecurringForm.tsx`

#### Step 31: Budget Components
Update budget components.

**Files:**
- MODIFY: `src/components/budgets/BudgetList.tsx`
- MODIFY: `src/components/budgets/BudgetDialog.tsx`
- MODIFY: `src/components/budgets/BudgetForm.tsx`
- MODIFY: `src/components/budgets/BudgetPageHeader.tsx`

#### Step 32: Goal Components
Update goal components.

**Files:**
- MODIFY: `src/components/goals/GoalList.tsx`
- MODIFY: `src/components/goals/GoalCard.tsx`
- MODIFY: `src/components/goals/GoalDialog.tsx`
- MODIFY: `src/components/goals/GoalForm.tsx`
- MODIFY: `src/components/goals/GoalPageHeader.tsx`

#### Step 33: Category Components
Update category components.

**Files:**
- MODIFY: `src/components/categories/CategoryList.tsx`
- MODIFY: `src/components/categories/CategoryDialog.tsx`
- MODIFY: `src/components/categories/CategorySelect.tsx`

---

### Phase H: Analytics & Settings (Day 6-7)

#### Step 34: Analytics Components
Update analytics components.

**Files:**
- MODIFY: `src/components/analytics/AnalyticsClient.tsx`
- MODIFY: `src/components/analytics/AnalyticsFilters.tsx`
- MODIFY: `src/components/analytics/TrendChart.tsx`
- MODIFY: `src/components/analytics/TransactionTable.tsx`
- MODIFY: `src/components/analytics/ExportButton.tsx`
- MODIFY: `src/components/analytics/MonthOverMonthComparison.tsx`

#### Step 35: Settings Components
Update settings components.

**Files:**
- MODIFY: `src/components/settings/ProfileSection.tsx`
- MODIFY: `src/components/settings/AppearanceSection.tsx`
- MODIFY: `src/components/settings/SecuritySection.tsx`
- MODIFY: `src/components/settings/AccountsSection.tsx`
- MODIFY: `src/components/settings/DataManagementSection.tsx`

#### Step 36: Plaid Components
Update bank connection components.

**Files:**
- MODIFY: `src/components/plaid/ConnectBankButton.tsx`
- MODIFY: `src/components/plaid/ConnectedAccount.tsx`

---

### Phase I: Assets & Polish (Day 7-8)

#### Step 37: Update Logo
Create or update logo to match CopperX style (or keep FinSight with new styling).

**Files:**
- CREATE/MODIFY: `public/logo.svg`
- MODIFY: `src/components/layout/Navbar.tsx` (update logo reference)

#### Step 38: Favicon
Update favicon if needed.

**Files:**
- MODIFY: `public/favicon.ico` or `src/app/favicon.ico`

#### Step 39: Animation Polish
Add/refine micro-interactions.

**Files:**
- Review all components for transition consistency

#### Step 40: Hover/Focus States
Ensure consistent interactive states.

**Files:**
- Review all interactive elements

---

### Phase J: Testing & QA (Day 8-9)

#### Step 41: Visual Regression Testing
Compare before/after screenshots for all pages.

**Pages to test:**
- Login page
- Register page
- Dashboard
- Transactions list
- Add transaction modal
- Budgets page
- Goals page
- Analytics page
- Settings page

#### Step 42: Cross-Browser Testing
Test in Chrome, Firefox, Safari.

#### Step 43: Responsive Testing
Test at 320px, 768px, 1024px, 1440px widths.

#### Step 44: Accessibility Audit
- Color contrast check
- Keyboard navigation
- Screen reader testing
- Focus indicators

#### Step 45: Dark Mode Testing
Verify dark mode styling is consistent.

---

### Phase K: Documentation & Handoff (Day 9-10)

#### Step 46: Update Documentation
Document the new design system.

**Files:**
- UPDATE: `docs/copperx-reskin/` files
- CREATE: `docs/copperx-reskin/06-style-guide.md`

#### Step 47: Create PR
Prepare pull request with:
- Before/after screenshots
- List of all changed files
- Testing notes
- Rollback instructions

---

## Implementation Priority Order

### Critical Path (Must Complete First)
1. Design tokens CSS file
2. Tailwind config update
3. Global styles update
4. Button component
5. Input component
6. Card component
7. Dialog component
8. Navbar component
9. Sidebar component

### Secondary Priority
10. Select component
11. Table component
12. Other UI primitives
13. Auth components
14. Dashboard components

### Tertiary Priority
15. Feature components (transactions, budgets, goals)
16. Analytics components
17. Settings components
18. Polish and assets

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| A: Foundation | 0.5 day | None |
| B: Global Styles | 0.5 day | Phase A |
| C: Core UI Components | 1.5 days | Phase B |
| D: Layout Components | 1 day | Phase C |
| E: Auth Components | 0.5 day | Phase C, D |
| F: Dashboard Components | 0.5 day | Phase C, D |
| G: Feature Components | 1 day | Phase C |
| H: Analytics & Settings | 1 day | Phase C |
| I: Assets & Polish | 1 day | All above |
| J: Testing & QA | 1.5 days | Phase I |
| K: Documentation | 0.5 day | Phase J |

**Total: ~9-10 working days**

---

## Risk Mitigation

### Potential Issues

1. **Breaking existing styles**
   - Mitigation: Feature branch, incremental commits
   - Rollback: Git revert or restore tokens file

2. **Component API changes**
   - Mitigation: Only change styling, not props/logic
   - Rollback: Individual component reverts

3. **Dark mode inconsistencies**
   - Mitigation: Test dark mode after each component update
   - Solution: CSS variable overrides in `.dark` class

4. **Performance impact**
   - Mitigation: Avoid heavy shadows/animations
   - Monitor: Check bundle size, render performance

5. **Accessibility regression**
   - Mitigation: Contrast checker during development
   - Audit: Final accessibility pass before merge

---

## Commit Strategy

### Commit Granularity
- One commit per component or logical group
- Descriptive commit messages

### Commit Message Format
```
style(component-name): description of visual change

Example:
style(button): update to CopperX design - solid bg, rounded-lg
style(sidebar): remove gradient, add indigo active state
style(dialog): reduce overlay opacity, add rounded-2xl
```

### Branch Strategy
- Feature branch: `feat/reskin-copperx`
- Create PR when Phase J complete
- Squash merge to main after approval
