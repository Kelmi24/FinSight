# CopperX Visual Inventory & Asset List

## Phase 1 Deliverable - Visual Audit

---

## 1. Screen Inventory

### Authentication Screens
| Screen | Screenshot Reference | Key Components |
|--------|---------------------|----------------|
| Login/Register | Image 14 (Create Copperx account) | Logo, card container, Google OAuth button, email input, divider, footer links |
| Create Account | Image 13 (Create your account) | Form inputs (first name, last name, password, confirm password), checkbox, primary button |
| Email OTP | Image 15 (Email authentication) | Logo, OTP input boxes (6 digits), timer, resend link, continue button |
| KYC Form | Image 12 (Verify your account) | Multi-step form, country select, name fields, email, phone with country code, dropdowns |

### Dashboard Screens
| Screen | Screenshot Reference | Key Components |
|--------|---------------------|----------------|
| Main Dashboard | Images 3, 5, 11 | Sidebar nav, balance card, action buttons (Deposit, To bank, Send, Get Paid), transaction list with tabs |
| Empty Dashboard | Image 11 | Empty state with "No transactions yet" message, CTA button |
| Balance Dropdown | Image 10 | Account selector, network icons (Polygon, Arbitrum, Base, etc.), balance per network |

### Modal/Dialog Screens
| Screen | Screenshot Reference | Key Components |
|--------|---------------------|----------------|
| Success Modal | Image 3 | Centered modal, green checkmark icon, success message, dual action buttons |
| Deposit Modal | Image 9 | Header with X close, network list with icons, section dividers |
| Deposit Fund (LI.FI) | Image 8 | From/To sections, amount input, wallet connect button |
| Withdraw to Bank | Image 6 | Amount input with currency, exchange rate info, processing details, CTA |
| Add Payee | Image 4 | Simple form modal, name/email fields, info text, Cancel/Add buttons |
| Transaction Details | Image 7 | Slide-out panel, status badge, transaction info rows, note textarea |

### List/Table Screens
| Screen | Screenshot Reference | Key Components |
|--------|---------------------|----------------|
| Recipients List | Image 1 | Search input, tabs (All, Bank Account, Wallet), table with actions dropdown |
| Recipients Dropdown | Image 1 | Popover menu with Update/Delete options |

### Feature Pages
| Screen | Screenshot Reference | Key Components |
|--------|---------------------|----------------|
| Savings Space | Image 2 | Centered illustration, APY badge, CTA button |
| Landing Page | Image 16 | Hero section, feature grid, testimonials, FAQ accordion |

---

## 2. Component Inventory

### Navigation
- **Sidebar** (Left navigation)
  - Logo: "Copperx" with "C" icon
  - Menu items with icons (Dashboard, Cards [NEW badge], Banking, Savings Space, Recipients, Invite, Travel [5% cashback badge])
  - "Invite and Earn" promo card at bottom
  - Help link

- **Top Bar** (Minimal)
  - Balance indicator with network icon
  - User avatar with name dropdown

### Buttons
| Type | Visual Style |
|------|--------------|
| Primary | Blue (#4F46E5), white text, rounded-lg (~12px), medium shadow |
| Secondary/Outline | White bg, gray border, dark text |
| Ghost | Transparent, text only |
| Destructive | Red text (for delete actions) |
| Icon Button | Rounded-full, subtle hover |

### Cards
- **Main Card**: White background, subtle border (#E5E7EB), rounded-xl (16px), soft shadow
- **Action Card**: Colored icon circle, title below, hover elevation
- **Balance Card**: Large typography, gradient or solid background option

### Form Controls
- **Input**: White bg, gray border (#E5E7EB), rounded-lg (8px), focus ring blue
- **Select/Dropdown**: Same as input, chevron icon, dropdown with rounded content
- **Checkbox**: Blue checked state, rounded-sm corners
- **OTP Input**: Individual digit boxes, bordered, focused state ring

### Tables
- **Header**: Light gray background, uppercase small text, no visible borders
- **Row**: White bg, subtle bottom border, hover state bg change
- **Actions**: "..." icon triggering popover menu

### Modals
- **Standard Modal**: Centered, max-width ~450px, rounded-xl (16px), shadow-2xl
- **Slide Panel**: Right-aligned, full height, for detailed views
- **Overlay**: Semi-transparent black (~50% opacity)

### Badges/Pills
- **NEW badge**: Blue background, white text, rounded-full, small font
- **Cashback badge**: Light purple/blue tint, percentage text
- **Status badge**: Green "Success", rounded, pill shape

### Tabs
- **Underline style**: Active tab has bottom border accent
- **Pill style**: Active tab has background fill

### Icons
- **Source**: Appears to be Lucide or similar line icon set
- **Size**: Generally 20-24px in menus, 16px inline
- **Color**: Gray-500 default, blue on active/hover

---

## 3. Required Assets

### Logos
| Asset | Current | Required Action |
|-------|---------|-----------------|
| Main Logo | FinSight (Wallet icon + text) | Create CopperX-style logo OR keep FinSight with CopperX styling |
| Favicon | Unknown | Update to match brand |

### Icons (Network/Crypto)
| Icon | Usage | Source |
|------|-------|--------|
| Polygon | Network selector | SVG needed |
| Base | Network selector | SVG needed |
| Arbitrum | Network selector | SVG needed |
| Starknet | Network selector | SVG needed |
| Solana | Network selector | SVG needed |
| USDC | Token display | SVG needed |
| LI.FI | Partner branding | SVG needed |

### Illustrations
| Asset | Usage |
|-------|-------|
| Savings jar/coin | Savings Space feature page |
| User avatars | Invite and Earn promo |
| Success checkmark | Confirmation modals |

### Patterns/Backgrounds
| Asset | Usage |
|-------|-------|
| Dot grid pattern | Auth page backgrounds |
| Gradient mesh | Landing page hero |

---

## 4. Color Analysis from Screenshots

### Primary Brand Colors
- **Primary Blue**: ~#4F46E5 (Indigo-600)
- **Primary Blue Light**: ~#6366F1 (Indigo-500)

### Background Colors
- **Page Background**: #F9FAFB (Gray-50)
- **Card Background**: #FFFFFF
- **Sidebar Background**: #FFFFFF
- **Dark sections**: Not visible in screenshots (light mode only shown)

### Text Colors
- **Heading**: #111827 (Gray-900)
- **Body**: #374151 (Gray-700)
- **Muted**: #6B7280 (Gray-500)
- **Placeholder**: #9CA3AF (Gray-400)

### Border Colors
- **Default border**: #E5E7EB (Gray-200)
- **Input border**: #D1D5DB (Gray-300)
- **Divider**: #F3F4F6 (Gray-100)

### Accent Colors
- **Success**: #10B981 (Green-500)
- **Error/Destructive**: #EF4444 (Red-500)
- **Warning**: #F59E0B (Amber-500)
- **Info Blue**: #3B82F6 (Blue-500)

### Interactive States
- **Hover (primary button)**: Slightly darker blue
- **Focus ring**: Blue-100 with blue-500 border
- **Active/Selected tab**: Blue underline or fill

---

## 5. Typography Analysis

### Font Family
- **Primary**: Inter or similar sans-serif (clean, modern geometric)
- **Monospace**: For transaction IDs, amounts, hashes

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Balance) | 48px / 3rem | Bold (700) | 1.1 |
| H2 (Modal Title) | 24px / 1.5rem | Semibold (600) | 1.25 |
| H3 (Section Title) | 18px / 1.125rem | Semibold (600) | 1.4 |
| Body | 14px / 0.875rem | Regular (400) | 1.5 |
| Small/Caption | 12px / 0.75rem | Medium (500) | 1.4 |
| Button | 14px / 0.875rem | Medium (500) | 1 |
| Input | 14px / 0.875rem | Regular (400) | 1.5 |
| Label | 14px / 0.875rem | Medium (500) | 1.4 |

### Letter Spacing
- **Uppercase labels**: 0.05em tracking
- **Headings**: -0.01em (tight)
- **Body**: Normal

---

## 6. Spacing & Layout

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline gaps, tight spacing |
| sm | 8px | Related element gaps |
| md | 16px | Section padding, form gaps |
| lg | 24px | Card padding, section margins |
| xl | 32px | Page sections |
| 2xl | 48px | Major layout breaks |

### Border Radius
| Element | Radius |
|---------|--------|
| Button | 8px (rounded-lg) |
| Card | 16px (rounded-xl) |
| Input | 8px (rounded-lg) |
| Modal | 16px (rounded-xl) |
| Avatar | 9999px (rounded-full) |
| Badge | 9999px (rounded-full) |
| Dropdown item | 8px |

### Shadows
| Level | CSS Value |
|-------|-----------|
| sm | 0 1px 2px rgba(0,0,0,0.05) |
| md | 0 4px 6px -1px rgba(0,0,0,0.1) |
| lg | 0 10px 15px -3px rgba(0,0,0,0.1) |
| xl | 0 20px 25px -5px rgba(0,0,0,0.1) |
| Modal | 0 25px 50px -12px rgba(0,0,0,0.25) |

---

## 7. Animation & Transitions

### Durations
- **Fast**: 150ms (hovers, small state changes)
- **Medium**: 200ms (dropdowns, toggles)
- **Slow**: 300ms (modals, page transitions)

### Easing
- **Default**: ease-out
- **Bounce**: For success animations

### Animations Observed
- Modal fade-in + scale
- Dropdown slide-down
- Button hover scale (subtle)
- Success checkmark pulse/bounce

---

## Next Steps
1. Create design tokens file based on this inventory
2. Map each existing component to CopperX equivalent
3. Create implementation plan with file-by-file changes
