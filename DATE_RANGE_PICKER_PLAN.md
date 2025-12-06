# Date Range Picker Implementation Plan

## 1. Current State Analysis

### Existing Components
- **`src/components/ui/date-picker.tsx`**: Single date picker with Save/Cancel, quick selects (Today, Tomorrow, etc.)
- **`src/components/ui/calendar.tsx`**: Uses `react-day-picker` v9 with existing range support (`range_middle`, `range_end` styles)
- **`src/providers/filter-provider.tsx`**: Global filter state with `startDate` and `endDate` as separate fields

### Current Usage Locations
| Component | File | Usage |
|-----------|------|-------|
| DashboardFilters | `src/components/dashboard/DashboardFilters.tsx` | Two separate DatePicker components |
| TransactionFilters | `src/components/transactions/TransactionFilters.tsx` | Two separate DatePicker components |
| TransactionForm | `src/components/transactions/TransactionForm.tsx` | Single date (transaction date) |
| RecurringForm | `src/components/transactions/RecurringForm.tsx` | Start/End dates for recurrence |
| GoalForm | `src/components/goals/GoalForm.tsx` | Single deadline date |

### Dependencies Available
- `react-day-picker@9.11.3` (already installed, supports range selection natively)
- `date-fns@4.1.0` (already installed)
- `@radix-ui/react-popover` (already used for existing DatePicker)

---

## 2. Architecture Design

### New Component: `DateRangePicker`

```
src/components/ui/date-range-picker.tsx
```

**Props Interface:**
```typescript
interface DateRangePickerProps {
  startDate?: string | null
  endDate?: string | null
  onChange: (range: { startDate: string | null; endDate: string | null }) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}
```

**Features:**
1. Single popover with one calendar
2. Range mode (`mode="range"` in react-day-picker)
3. Visual highlight for selected range
4. Quick select presets below calendar
5. Save/Cancel buttons (no auto-apply)
6. Clear button to reset selection
7. Display format: `Jan 5 — Jan 20, 2025`

### Quick Select Presets
| Preset | Logic |
|--------|-------|
| Today | startDate = today, endDate = today |
| Yesterday | startDate = yesterday, endDate = yesterday |
| Last 7 Days | startDate = today - 6, endDate = today |
| Last 30 Days | startDate = today - 29, endDate = today |
| This Month | startDate = 1st of month, endDate = today |
| Last Month | startDate = 1st of prev month, endDate = last of prev month |
| Custom Range | No preset, user selects manually |

---

## 3. Files to Modify

### New Files
| File | Purpose |
|------|---------|
| `src/components/ui/date-range-picker.tsx` | New unified range picker component |

### Modified Files
| File | Changes |
|------|---------|
| `src/components/dashboard/DashboardFilters.tsx` | Replace 2 DatePickers with 1 DateRangePicker |
| `src/components/transactions/TransactionFilters.tsx` | Replace 2 DatePickers with 1 DateRangePicker |
| `src/components/ui/calendar.tsx` | Add range-specific styling improvements |

### Unchanged Files
| File | Reason |
|------|--------|
| `src/components/ui/date-picker.tsx` | Keep for single-date use cases (transaction date, goal deadline) |
| `src/components/transactions/TransactionForm.tsx` | Uses single date |
| `src/components/transactions/RecurringForm.tsx` | Uses separate start/end (different UX need) |
| `src/components/goals/GoalForm.tsx` | Uses single deadline date |

---

## 4. State Management Integration

### Filter Provider Sync
The existing `FilterProvider` already has:
```typescript
interface DashboardFilters {
  startDate: string | null
  endDate: string | null
  // ...other fields
}
```

**Integration Pattern:**
```tsx
const { filters, updateFilter } = useFilter()

<DateRangePicker
  startDate={filters.startDate}
  endDate={filters.endDate}
  onChange={({ startDate, endDate }) => {
    updateFilter('startDate', startDate)
    updateFilter('endDate', endDate)
  }}
/>
```

### Dashboard ↔ Transactions Sync
Both components use the same `FilterProvider` context, so updates automatically sync.

---

## 5. UI/UX Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  [📅 Jan 5 — Jan 20, 2025              ][✕]            │  ← Trigger button
└─────────────────────────────────────────────────────────┘
                        ↓ Click opens popover
┌─────────────────────────────────────────────────────────┐
│  ◀  January 2025                                    ▶   │
│  ───────────────────────────────────────────────────── │
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat                      │
│       [1]   2    3    4   ███ ███                       │
│  ███ ███ ███ ███ ███ ███ ███  ← Highlighted range       │
│  ███ ███ ███ ███ ███ ███ ███                            │
│  ███ [20] 21   22   23   24   25                        │
│   26   27   28   29   30   31                           │
│  ───────────────────────────────────────────────────── │
│  Quick Select:                                          │
│  [Today] [Yesterday] [Last 7 Days] [Last 30 Days]       │
│  [This Month] [Last Month] [Custom Range]               │
│  ───────────────────────────────────────────────────── │
│                              [Cancel]  [Save]           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Styling Requirements

### Dark Mode Support
- Background: `bg-white dark:bg-gray-800`
- Border: `border-gray-200 dark:border-gray-700`
- Text: `text-gray-900 dark:text-gray-100`
- Range highlight: `bg-primary-100 dark:bg-primary-900/30`
- Selected endpoints: `bg-primary-600 text-white`

### Responsive Design
- Mobile: Full-width popover, stacked preset buttons
- Tablet+: Side-by-side preset buttons, comfortable padding

### CopperX Consistency
- Border radius: `rounded-lg` (12px)
- Shadow: `shadow-lg`
- Padding: `p-4`
- Button variants match existing `Button` component

---

## 7. Test Cases

### Functional Tests
| Test | Expected |
|------|----------|
| Click first date | Selects as start date |
| Click second date | Selects as end date, highlights range |
| Click Save | Commits selection, closes popover |
| Click Cancel | Reverts to previous, closes popover |
| Click preset (Last 7 Days) | Sets both dates, shows in calendar |
| Click Clear | Resets both dates to null |
| Change in Dashboard | Reflects in Transactions page |

### Edge Cases
| Case | Behavior |
|------|----------|
| End date before start date | Swap automatically |
| Click same date twice | Sets single-day range (start = end) |
| No dates selected + Save | Sets both to null |
| Timezone handling | Use local timezone, format with date-fns |

### Accessibility
- Keyboard navigation (arrow keys, Enter, Escape)
- Screen reader labels
- Focus management on open/close

---

## 8. Implementation Order

1. **Create `DateRangePicker` component** - Core functionality
2. **Update Calendar styling** - Range-specific visual improvements
3. **Update DashboardFilters** - Replace two pickers with one
4. **Update TransactionFilters** - Same replacement
5. **Test synchronization** - Verify global state works
6. **Build & deploy** - Verify no regressions

---

## 9. Success Criteria

✅ Single calendar controls both From & To dates
✅ Range clearly highlighted between start and end
✅ Save/Cancel required (no auto-apply)
✅ Quick select presets work correctly
✅ Fully synced between Dashboard and Transactions
✅ No clipping, overflow, or layout bugs
✅ Dark mode compatible
✅ Responsive on mobile/tablet/desktop
✅ Matches existing CopperX design system
