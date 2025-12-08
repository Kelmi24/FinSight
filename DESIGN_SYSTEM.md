# FinSight AI Design System

## Overview
This document defines the complete design system for FinSight AI, including colors, typography, spacing, components, and usage guidelines.

---

## 1. Color System

### Semantic Colors (Light Mode)

#### Background Colors
- **Page Background**: `#F9FAFB` (Gray 50) - Main app background
- **Card Background**: `#FFFFFF` (White) - Cards, modals, dropdowns
- **Hover Background**: `#F3F4F6` (Gray 100) - Interactive elements on hover
- **Selected Background**: `#EEF2FF` (Indigo 50) - Selected/active states

#### Text Colors
- **Primary Text**: `#111827` (Gray 900) - Headlines, body text
- **Secondary Text**: `#374151` (Gray 700) - Subtext, labels
- **Muted Text**: `#6B7280` (Gray 500) - Placeholders, disabled text
- **Inverse Text**: `#FFFFFF` (White) - Text on dark backgrounds

#### Border Colors
- **Default Border**: `#E5E7EB` (Gray 200) - Cards, dividers
- **Input Border**: `#D1D5DB` (Gray 300) - Form inputs
- **Focus Border**: `#4F46E5` (Indigo 600) - Focus rings

#### Brand Colors (Primary)
```css
--primary-50:  #EEF2FF   /* Lightest */
--primary-100: #E0E7FF
--primary-200: #C7D2FE
--primary-300: #A5B4FC
--primary-400: #818CF8
--primary-500: #6366F1   /* Main brand color */
--primary-600: #4F46E5   /* Buttons, links */
--primary-700: #4338CA
--primary-800: #3730A3
--primary-900: #312E81   /* Darkest */
```

#### Status Colors

**Success (Green)**
- Background: `#ECFDF5` (Emerald 50)
- Text: `#059669` (Emerald 600)
- Border: `#A7F3D0` (Emerald 200)

**Error (Red)**
- Background: `#FEF2F2` (Red 50)
- Text: `#DC2626` (Red 600)
- Border: `#FECACA` (Red 200)

**Warning (Amber)**
- Background: `#FFFBEB` (Amber 50)
- Text: `#D97706` (Amber 600)
- Border: `#FDE68A` (Amber 200)

**Info (Blue)**
- Background: `#EFF6FF` (Blue 50)
- Text: `#2563EB` (Blue 600)
- Border: `#BFDBFE` (Blue 200)

### Dark Mode Colors

#### Background Colors
- **Page Background**: `#0F172A` (Slate 900)
- **Card Background**: `#1E293B` (Slate 800)
- **Hover Background**: `#334155` (Slate 700)

#### Text Colors
- **Primary Text**: `#F8FAFC` (Slate 50) - WCAG AAA (7:1 contrast)
- **Secondary Text**: `#E2E8F0` (Slate 200)
- **Muted Text**: `#94A3B8` (Slate 400)

#### Border Colors
- **Default Border**: `#334155` (Slate 700)
- **Input Border**: `#475569` (Slate 600)

### Color Usage Guidelines

✅ **Do:**
- Use semantic color tokens (`--primary`, `--success`, etc.)
- Maintain 4.5:1 contrast ratio for text (WCAG AA)
- Use status colors consistently across the app

❌ **Don't:**
- Hardcode hex values directly in components
- Mix custom colors with system colors
- Use low-contrast color combinations

---

## 2. Typography

### Font Families

**Sans-Serif (Primary)**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Monospace (Code/Numbers)**
```css
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 
             'Monaco', 'Consolas', monospace;
```

### Type Scale

| Element | Size (Mobile) | Size (Desktop) | Weight | Line Height | Usage |
|---------|---------------|----------------|--------|-------------|-------|
| **H1** | 30px (1.875rem) | 36px (2.25rem) | Bold (700) | 1.2 | Page titles |
| **H2** | 24px (1.5rem) | 30px (1.875rem) | Semibold (600) | 1.3 | Section headings |
| **H3** | 20px (1.25rem) | 24px (1.5rem) | Semibold (600) | 1.4 | Subsection headings |
| **H4** | 18px (1.125rem) | 20px (1.25rem) | Semibold (600) | 1.4 | Card titles |
| **H5** | 16px (1rem) | 18px (1.125rem) | Semibold (600) | 1.5 | Labels, small headings |
| **H6** | 14px (0.875rem) | 16px (1rem) | Semibold (600) | 1.5 | Overlines, captions |
| **Body** | 16px (1rem) | 16px (1rem) | Regular (400) | 1.5 | Main content |
| **Small** | 14px (0.875rem) | 14px (0.875rem) | Regular (400) | 1.5 | Helper text |
| **XSmall** | 12px (0.75rem) | 12px (0.75rem) | Regular (400) | 1.5 | Captions, metadata |

### Font Weights

- **Regular**: 400 (Body text, descriptions)
- **Medium**: 500 (Emphasized text)
- **Semibold**: 600 (Headings, labels, buttons)
- **Bold**: 700 (Primary headings)

### Typography Classes

```tsx
// Headings
<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
<h3 className="text-xl font-semibold tracking-tight sm:text-2xl">

// Body text
<p className="text-base text-foreground">
<p className="text-sm text-muted-foreground">

// Labels
<label className="text-sm font-medium leading-none">
```

---

## 3. Spacing System

### Scale (based on 4px grid)

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `spacing-0` | 0 | 0px | Reset margins |
| `spacing-0.5` | 0.125rem | 2px | Tight spacing |
| `spacing-1` | 0.25rem | 4px | Icon gaps |
| `spacing-2` | 0.5rem | 8px | Small gaps |
| `spacing-3` | 0.75rem | 12px | Compact spacing |
| `spacing-4` | 1rem | 16px | Default spacing |
| `spacing-5` | 1.25rem | 20px | Medium spacing |
| `spacing-6` | 1.5rem | 24px | Large spacing |
| `spacing-8` | 2rem | 32px | Section spacing |
| `spacing-10` | 2.5rem | 40px | Large sections |
| `spacing-12` | 3rem | 48px | Page sections |
| `spacing-16` | 4rem | 64px | Major sections |
| `spacing-20` | 5rem | 80px | Hero spacing |

### Component Spacing Guidelines

**Buttons**
- Padding: `px-4 py-2` (16px horizontal, 8px vertical)
- Gap between icon and text: `gap-2` (8px)

**Cards**
- Padding: `p-6` (24px) on desktop, `p-4` (16px) on mobile
- Gap between cards: `gap-4` (16px) or `gap-6` (24px)

**Forms**
- Field spacing: `space-y-4` (16px between fields)
- Label to input: `mt-2` (8px)
- Form sections: `space-y-6` (24px)

**Layouts**
- Page padding: `p-6` (24px) on desktop, `p-4` (16px) on mobile
- Section spacing: `space-y-8` (32px)
- Content max width: `max-w-7xl` (1280px)

---

## 4. Border Radius

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `rounded-none` | 0 | 0px | Square corners |
| `rounded-sm` | 0.25rem | 4px | Tight radius |
| `rounded` | 0.375rem | 6px | Default radius |
| `rounded-md` | 0.375rem | 6px | Inputs, small buttons |
| `rounded-lg` | 0.5rem | 8px | Cards, buttons |
| `rounded-xl` | 0.75rem | 12px | Large cards |
| `rounded-2xl` | 1rem | 16px | Modals, dropdowns |
| `rounded-3xl` | 1.5rem | 24px | Special elements |
| `rounded-full` | 9999px | Circle | Avatars, badges |

### Component Radius Standards

- **Buttons**: `rounded-lg` (8px)
- **Inputs**: `rounded-md` (6px)
- **Cards**: `rounded-xl` (12px)
- **Modals**: `rounded-2xl` (16px)
- **Avatars**: `rounded-full`
- **Badges**: `rounded-full`

---

## 5. Shadows

### Shadow Scale

```css
/* Extra Small - Subtle depth */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Small - Default cards */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Medium - Elevated elements */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* Large - Dropdowns */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* Extra Large - Modals */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* 2X Large - Modals with backdrop */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Card Shadow (default) */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Card Hover */
--shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

/* Dropdown Shadow */
--shadow-dropdown: 0 10px 40px rgba(0, 0, 0, 0.15);

/* Modal Shadow */
--shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Shadow Usage

- **Cards (Resting)**: `shadow-sm` or `shadow-card`
- **Cards (Hover)**: `shadow-md` or `shadow-card-hover`
- **Dropdowns**: `shadow-lg` or `shadow-dropdown`
- **Modals**: `shadow-2xl` or `shadow-modal`
- **Floating Action Buttons**: `shadow-lg`

---

## 6. Component Standards

### Button Variants

**Primary (Default)**
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</Button>
```

**Secondary**
```tsx
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  Secondary Action
</Button>
```

**Destructive**
```tsx
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Delete
</Button>
```

**Outline**
```tsx
<Button variant="outline" className="border-border hover:bg-accent">
  Cancel
</Button>
```

**Ghost**
```tsx
<Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
  View Details
</Button>
```

### Button Sizes

- **Small**: `h-9 px-3 text-sm` (36px height, 12px padding)
- **Default**: `h-10 px-4 py-2` (40px height, 16px padding)
- **Large**: `h-11 px-8` (44px height, 32px padding)
- **Icon**: `h-10 w-10` (40x40px square)

### Card Variants

**Default Card**
```tsx
<div className="rounded-xl border border-border bg-card p-6 shadow-card">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content</p>
</div>
```

**Hover Card**
```tsx
<div className="rounded-xl border border-border bg-card p-6 shadow-card
               hover:shadow-card-hover transition-shadow cursor-pointer">
  Clickable card content
</div>
```

**Status Card**
```tsx
<div className="rounded-xl border-2 border-success bg-success/10 p-6">
  <h3 className="text-success font-semibold">Success!</h3>
</div>
```

### Input Standards

**Default Input**
```tsx
<input
  className="flex h-10 w-full rounded-md border border-input
             bg-background px-3 py-2 text-sm
             ring-offset-background
             file:border-0 file:bg-transparent file:text-sm file:font-medium
             placeholder:text-muted-foreground
             focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-ring focus-visible:ring-offset-2
             disabled:cursor-not-allowed disabled:opacity-50"
/>
```

### Table Styling

**Default Table**
```tsx
<div className="rounded-lg border border-border overflow-hidden">
  <table className="w-full">
    <thead className="bg-muted">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      <tr className="hover:bg-muted/50 transition-colors">
        <td className="px-4 py-3 text-sm text-foreground">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 7. Animation Standards

### Transition Timing

- **Fast**: 150ms (micro-interactions: hover, focus)
- **Default**: 200ms (most transitions)
- **Slow**: 300ms (complex animations, modals)

### Easing Functions

- **Ease-out**: Default for entering elements
- **Ease-in**: For exiting elements
- **Ease-in-out**: For state changes

### Common Animations

**Fade In**
```css
animation: fadeIn 200ms ease-out;

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Down**
```css
animation: slideDown 200ms ease-out;

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Scale In**
```css
animation: scaleIn 150ms ease-out;

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Value | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets (portrait) |
| `md` | 768px | Tablets (landscape) |
| `lg` | 1024px | Laptops, small desktops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Mobile-First Approach

Always design for mobile first, then add complexity:

```tsx
// Mobile: stack vertically, Desktop: row layout
<div className="flex flex-col lg:flex-row gap-4">
  <div className="w-full lg:w-1/2">Column 1</div>
  <div className="w-full lg:w-1/2">Column 2</div>
</div>

// Mobile: hidden, Desktop: visible
<div className="hidden lg:block">Desktop only</div>

// Mobile: full width, Desktop: max width
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Content
</div>
```

---

## 9. Accessibility Guidelines

### Contrast Ratios

- **Text**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1 (WCAG AA)
- **Target**: 7:1 for body text (WCAG AAA)

### Focus States

All interactive elements must have visible focus states:

```tsx
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-offset-2
```

### ARIA Labels

- All icon buttons must have `aria-label`
- Forms must have proper `label` associations
- Dialogs must have `aria-labelledby` and `aria-describedby`

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order must be logical
- Skip links must be provided for main content

---

## 10. Usage Examples

### Dashboard Card
```tsx
<div className="rounded-xl border border-border bg-card p-6 shadow-card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-card-foreground">
      Total Balance
    </h3>
    <TrendingUp className="h-5 w-5 text-success" />
  </div>
  <p className="text-3xl font-bold text-foreground">$12,450.00</p>
  <p className="text-sm text-muted-foreground mt-2">
    +12.5% from last month
  </p>
</div>
```

### Form Layout
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none text-foreground">
      Email
    </label>
    <input
      type="email"
      className="flex h-10 w-full rounded-md border border-input
                 bg-background px-3 py-2 text-sm
                 placeholder:text-muted-foreground
                 focus-visible:ring-2 focus-visible:ring-ring"
      placeholder="Enter your email"
    />
  </div>
  
  <div className="flex gap-3">
    <Button type="submit" className="flex-1">
      Submit
    </Button>
    <Button type="button" variant="outline">
      Cancel
    </Button>
  </div>
</form>
```

### Status Alert
```tsx
<Alert variant="success">
  <CheckCircle2 className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your transaction has been completed successfully.
  </AlertDescription>
</Alert>
```

---

## 11. Best Practices

### Do's ✅

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- Use design tokens instead of hardcoded values
- Maintain consistent spacing using the 4px grid
- Test in both light and dark modes
- Ensure all text meets WCAG AA contrast requirements
- Use meaningful `alt` text for images
- Provide loading states for async operations

### Don'ts ❌

- Don't use `div` with click handlers (use `<button>`)
- Don't hardcode colors or spacing values
- Don't rely solely on color to convey information
- Don't forget focus states on interactive elements
- Don't use absolute positioning unless necessary
- Don't create custom components that duplicate existing ones

---

## 12. Component Inventory

### UI Components (Completed)
- ✅ Alert (5 variants)
- ✅ Avatar (with fallback)
- ✅ Badge (7 variants)
- ✅ Button (5 variants, 4 sizes)
- ✅ Card (default, hover, status)
- ✅ Dialog (modal with backdrop)
- ✅ Input (text, email, password, number)
- ✅ Pagination (full component with ellipsis)
- ✅ Select (dropdown with search)
- ✅ Skeleton (4 variants)
- ✅ Tooltip (hover/focus)

### Form Components (Completed)
- ✅ AmountInput (currency input)
- ✅ CurrencySelect (11 currencies)

### Layout Components
- ✅ Navbar (with user menu)
- ✅ Sidebar (collapsible navigation)
- ✅ Footer

### Domain Components
- ✅ TransactionList (with pagination)
- ✅ BudgetCard
- ✅ GoalCard
- ✅ DashboardKPI
- ✅ CashFlowChart
- ✅ CategoryChart

---

## Conclusion

This design system provides a comprehensive foundation for building consistent, accessible, and beautiful UI in FinSight AI. All components should follow these guidelines to ensure a cohesive user experience across the application.

For questions or suggestions, please refer to the component files in `src/components/ui/` for implementation details.
