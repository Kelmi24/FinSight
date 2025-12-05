# CopperX Reskin QA & Rollback Plan

## Phase 4 Deliverable - Testing & Rollback Strategy

---

## QA Checklist

### Visual Regression Testing

#### Auth Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Login | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Register | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Forgot Password | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Reset Password | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

#### Dashboard Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Dashboard (Main) | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Dashboard (Empty) | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

#### Transaction Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Transaction List | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Add Transaction Modal | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Edit Transaction Modal | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Delete Confirmation | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Recurring Transactions | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

#### Budget Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Budget List | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Add Budget Modal | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Edit Budget Modal | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

#### Goal Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Goals List | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Add Goal Modal | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Goal Progress View | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

#### Analytics Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Analytics Overview | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Charts Display | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Export Options | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

#### Settings Pages
| Page | Screenshot Taken | Visual Match | Notes |
|------|-----------------|--------------|-------|
| Profile Settings | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Appearance Settings | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Security Settings | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Connected Accounts | ☐ Before ☐ After | ☐ Pass ☐ Fail | |
| Data Management | ☐ Before ☐ After | ☐ Pass ☐ Fail | |

---

## Interaction Testing

### Forms & Inputs
| Interaction | Light Mode | Dark Mode | Notes |
|-------------|-----------|-----------|-------|
| Input focus state | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Input validation errors | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Select dropdown opens | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Select item selection | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Date picker opens | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Date selection works | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Checkbox toggle | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Button hover state | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Button click feedback | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Button disabled state | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

### Navigation
| Interaction | Light Mode | Dark Mode | Notes |
|-------------|-----------|-----------|-------|
| Sidebar item hover | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Sidebar active state | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| User menu opens | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| User menu closes on click outside | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Theme toggle works | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Logo click navigates to dashboard | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

### Modals & Dialogs
| Interaction | Light Mode | Dark Mode | Notes |
|-------------|-----------|-----------|-------|
| Modal opens with animation | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Modal closes on X click | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Modal closes on overlay click | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Modal closes on Escape key | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Modal form submission | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Confirmation dialogs work | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

### Tables
| Interaction | Light Mode | Dark Mode | Notes |
|-------------|-----------|-----------|-------|
| Row hover state | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Row selection (if applicable) | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Action dropdown opens | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Sort headers work | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Pagination works | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

### Cards
| Interaction | Light Mode | Dark Mode | Notes |
|-------------|-----------|-----------|-------|
| Card hover state | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| KPI cards display correctly | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Goal progress cards | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

---

## Cross-Browser Testing

### Browsers to Test
| Browser | Version | OS | Status | Notes |
|---------|---------|-----|--------|-------|
| Chrome | Latest | macOS | ☐ Pass ☐ Fail | |
| Chrome | Latest | Windows | ☐ Pass ☐ Fail | |
| Firefox | Latest | macOS | ☐ Pass ☐ Fail | |
| Firefox | Latest | Windows | ☐ Pass ☐ Fail | |
| Safari | Latest | macOS | ☐ Pass ☐ Fail | |
| Safari | Latest | iOS | ☐ Pass ☐ Fail | |
| Edge | Latest | Windows | ☐ Pass ☐ Fail | |

### Known Browser Issues to Check
- [ ] CSS variables fallbacks work
- [ ] Flexbox/Grid layouts render correctly
- [ ] Animations smooth in all browsers
- [ ] Shadows render consistently
- [ ] Border radius consistent
- [ ] Font rendering (Inter font)

---

## Responsive Testing

### Breakpoints to Test

#### Mobile (320px - 639px)
| Page | Layout OK | Touch Targets | Readability | Notes |
|------|-----------|---------------|-------------|-------|
| Login | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Dashboard | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Transactions | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Settings | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Modals | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

#### Tablet (768px - 1023px)
| Page | Layout OK | Touch Targets | Readability | Notes |
|------|-----------|---------------|-------------|-------|
| Login | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Dashboard | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Transactions | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Settings | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

#### Desktop (1024px - 1439px)
| Page | Layout OK | Spacing | Readability | Notes |
|------|-----------|---------|-------------|-------|
| All pages | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

#### Large Desktop (1440px+)
| Page | Layout OK | Max-width | Readability | Notes |
|------|-----------|-----------|-------------|-------|
| All pages | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

---

## Accessibility Testing

### Color Contrast (WCAG AA)
| Element | Foreground | Background | Ratio | Status |
|---------|------------|------------|-------|--------|
| Body text | #374151 | #F9FAFB | 7.4:1 | ☐ Pass |
| Heading text | #111827 | #FFFFFF | 15.6:1 | ☐ Pass |
| Primary button text | #FFFFFF | #4F46E5 | 4.6:1 | ☐ Pass |
| Link text | #4F46E5 | #FFFFFF | 4.9:1 | ☐ Pass |
| Muted text | #6B7280 | #FFFFFF | 4.8:1 | ☐ Pass |
| Error text | #DC2626 | #FFFFFF | 5.9:1 | ☐ Pass |
| Success text | #059669 | #FFFFFF | 4.6:1 | ☐ Pass |

### Dark Mode Contrast
| Element | Foreground | Background | Ratio | Status |
|---------|------------|------------|-------|--------|
| Body text | #E5E7EB | #0F172A | 11.5:1 | ☐ Pass |
| Heading text | #F9FAFB | #1E293B | 12.4:1 | ☐ Pass |
| Primary button | #FFFFFF | #6366F1 | 5.0:1 | ☐ Pass |

### Keyboard Navigation
| Action | Works | Focus Visible | Notes |
|--------|-------|---------------|-------|
| Tab through form fields | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Enter to submit forms | ☐ Pass ☐ Fail | N/A | |
| Escape to close modals | ☐ Pass ☐ Fail | N/A | |
| Arrow keys in dropdowns | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Space to toggle checkboxes | ☐ Pass ☐ Fail | N/A | |
| Tab through sidebar | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

### Screen Reader Compatibility
| Element | Aria Labels | Semantic HTML | Notes |
|---------|------------|---------------|-------|
| Navigation | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Forms | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Modals | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Tables | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |
| Buttons | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | |

---

## Performance Testing

### Metrics to Monitor
| Metric | Before | After | Status |
|--------|--------|-------|--------|
| First Contentful Paint (FCP) | | | ☐ OK ☐ Regression |
| Largest Contentful Paint (LCP) | | | ☐ OK ☐ Regression |
| Cumulative Layout Shift (CLS) | | | ☐ OK ☐ Regression |
| Time to Interactive (TTI) | | | ☐ OK ☐ Regression |
| Bundle Size (JS) | | | ☐ OK ☐ Regression |
| Bundle Size (CSS) | | | ☐ OK ☐ Regression |

### Performance Checklist
- [ ] No heavy box-shadows causing repaints
- [ ] Animations use transform/opacity (GPU accelerated)
- [ ] No layout thrashing on interactions
- [ ] Images optimized
- [ ] Font loading optimized (font-display: swap)

---

## Functional Regression Testing

### Critical User Flows
| Flow | Works | Notes |
|------|-------|-------|
| User can log in | ☐ Pass ☐ Fail | |
| User can register | ☐ Pass ☐ Fail | |
| User can create transaction | ☐ Pass ☐ Fail | |
| User can edit transaction | ☐ Pass ☐ Fail | |
| User can delete transaction | ☐ Pass ☐ Fail | |
| User can create budget | ☐ Pass ☐ Fail | |
| User can create goal | ☐ Pass ☐ Fail | |
| User can update profile | ☐ Pass ☐ Fail | |
| User can toggle theme | ☐ Pass ☐ Fail | |
| User can log out | ☐ Pass ☐ Fail | |
| User can export data | ☐ Pass ☐ Fail | |
| User can connect bank (mock) | ☐ Pass ☐ Fail | |

---

## Rollback Strategy

### Quick Rollback (Immediate)

If critical issues are found after merge:

```bash
# Option 1: Revert the merge commit
git revert -m 1 <merge-commit-hash>
git push origin main

# Option 2: Reset to previous state (destructive)
git reset --hard <commit-before-merge>
git push --force origin main  # Use with caution
```

### Partial Rollback (Specific Components)

If specific components have issues:

```bash
# Checkout specific files from before the change
git checkout <commit-before-merge> -- src/components/ui/button.tsx
git commit -m "revert: restore button component to previous version"
git push origin main
```

### Token Rollback

If the new tokens cause widespread issues:

```bash
# Restore original globals.css
git checkout <commit-before-merge> -- src/app/globals.css
git checkout <commit-before-merge> -- tailwind.config.ts

# Remove new tokens file
git rm src/styles/copperx-tokens.css

git commit -m "revert: restore original design tokens"
git push origin main
```

### Feature Flag Approach (Recommended for Safe Rollout)

For gradual rollout, implement a feature flag:

```tsx
// In a config file or environment variable
const USE_COPPERX_THEME = process.env.NEXT_PUBLIC_USE_COPPERX_THEME === 'true'

// In layout or provider
<body className={USE_COPPERX_THEME ? 'theme-copperx' : 'theme-original'}>
```

This allows instant rollback by changing the environment variable.

---

## Rollback Preparation

### Before Merge Checklist

- [ ] Tag the last known good commit: `git tag pre-reskin-v1.0`
- [ ] Document current design tokens (screenshot/backup)
- [ ] Create database backup (if design affects data)
- [ ] Prepare rollback PR/branch ready to merge
- [ ] Notify team of rollback procedure

### Post-Merge Monitoring

- [ ] Monitor error tracking (Sentry, etc.) for spikes
- [ ] Check analytics for user flow completion rates
- [ ] Monitor support tickets for visual issues
- [ ] Check Lighthouse scores for performance regressions

### Rollback Decision Criteria

**Immediate Rollback Required:**
- Critical functionality broken (login, transactions)
- Accessibility failures (WCAG violations)
- Major layout breaks on common devices
- Performance regression >50%

**Scheduled Rollback (next business day):**
- Minor visual inconsistencies
- Edge case bugs
- Non-critical component issues

---

## Sign-off Checklist

### Before Merge Approval

| Requirement | Reviewer | Status | Date |
|-------------|----------|--------|------|
| Visual QA complete | | ☐ Approved | |
| Interaction testing complete | | ☐ Approved | |
| Cross-browser testing complete | | ☐ Approved | |
| Responsive testing complete | | ☐ Approved | |
| Accessibility audit passed | | ☐ Approved | |
| Performance benchmarks met | | ☐ Approved | |
| Functional regression passed | | ☐ Approved | |
| Code review approved | | ☐ Approved | |
| Rollback plan documented | | ☐ Approved | |

### Final Approval

- [ ] Product Owner sign-off
- [ ] Tech Lead sign-off
- [ ] Ready to merge

---

## Post-Launch Monitoring Plan

### Day 1 After Merge
- [ ] Check error logs every 2 hours
- [ ] Review user feedback channels
- [ ] Spot-check key user flows
- [ ] Monitor performance metrics

### Week 1 After Merge
- [ ] Daily error log review
- [ ] Weekly user feedback summary
- [ ] Performance trend analysis
- [ ] Address any reported issues

### Month 1 After Merge
- [ ] Full accessibility re-audit
- [ ] User feedback survey (if applicable)
- [ ] Performance optimization pass
- [ ] Documentation updates
