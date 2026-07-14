# Wayta Codebase Mapping
## Design Handoff Alignment with Actual Codebase

### Important Context
The design handoff (IMPLEMENTATION_PLAN.md, PROMPTS.md) references a **Vite + React app** with `src/views/` and `src/components/` directories. The **actual codebase is Next.js 16 with App Router** using `src/app/` for pages and `src/components/` for components.

This mapping translates the handoff instructions to the Next.js structure and identifies what needs to be built.

---

## Current App Structure

### Existing Pages (Next.js App Router)
| Route | File | Current Status |
|---|---|---|
| `/` | `src/app/page.tsx` | Dev landing page with navigation links |
| `/venues` | `src/app/venues/page.tsx` | Venue discovery (Explore tab) — partial |
| `/venues/[slug]` | `src/app/venues/[slug]/page.tsx` | Venue details page |
| `/venues/[slug]/menu` | `src/app/venues/[slug]/menu/page.tsx` | Digital menu (WaytaMenu) — partial |
| `/orders/[id]` | `src/app/orders/[id]/page.tsx` | Order tracking (OrderStatusScreen) — exists, needs redesign |
| `/budget` | `src/app/budget/page.tsx` | Budget dashboard (BudgetDialog) — exists, needs redesign |

### Existing Components
| Component | File | Current Status |
|---|---|---|
| WaytaBottomNav | `src/components/wayta-bottom-nav.tsx` | Needs rebuild: center Scan slot, labels 11px, hide in order flow |
| WaytaHeader | `src/components/wayta-header.tsx` | Keep as-is (just needs color tokens) |

### Supporting Files
| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout with fonts — needs font swap (Manrope + Space Grotesk + JetBrains Mono) |
| `src/app/globals.css` | Design tokens — needs complete palette replacement |
| `src/lib/venues.ts` | Mock venue data |
| `src/lib/menu.ts` | Mock menu data + `formatZar()` helper |

---

## Phase 0: Token Foundation Mapping

### Files to Modify
- **`src/app/globals.css`** — Replace entire palette
- **`src/app/layout.tsx`** — Swap fonts (remove Inter, add Manrope, Space Grotesk, JetBrains Mono)

### Current Token Issues to Fix
| Issue | Location | Fix |
|---|---|---|
| Emerald green branding | Entire codebase | Replace `#34d399`, `#10b981`, `#059669`, `#6ee7b7` with amber `#d97706` + hover/press variants |
| Typography using Inter | `layout.tsx` | Swap to Manrope (body), Space Grotesk (display), JetBrains Mono (prices/codes) |
| Text below 11px | Multiple pages (labels 10px) | Fix: minimum 11px, labels 13px, captions 12px |
| No light mode tokens | `globals.css` | Add `[data-theme="light"]` block with light palette |
| Secondary purple/magenta | Code (e.g., secondary = `#a90097`) | Replace with go/warn/stop semantic colors |
| Ambient animations | Multiple pages | Remove `animate-pulse`, `animate-ping`, `animate-bounce` |

### Emerald Color Usage (Search Results)
Locations using emerald that need to be replaced:

**In globals.css:**
- `--primary: #34d399` (emerald main)
- `--primary-container: #10b981` (emerald dark)
- `--secondary: #059669` (emerald secondary)
- `--secondary-container: #6ee7b7` (emerald light)
- `--glow-accent-rgb: 52, 211, 153` (emerald glow)

**In components & pages using primary/secondary tokens:**
- `wayta-bottom-nav.tsx` — active state glow + color
- `wayta-header.tsx` — brand color
- All pages — buttons, accents, status indicators

**Direct hex values (if any):**
- `wayta-bottom-nav.tsx` — `drop-shadow-[0_0_8px_rgba(var(--glow-accent-rgb),0.6)]`
- `orders/[id]/page.tsx` — animated status dots, step indicators

---

## Phase 1: Universal Primitives — New Components to Build

These need to be created in `src/components/`:

| Component | Purpose | Specs from Plan |
|---|---|---|
| **Snackbar** | Toast replacement + alert() replacement | Bottom-anchored, 44px dismiss, swipe-to-dismiss, action slot, duration scaled |
| **BottomSheet** | Modal/dialog replacement | Dark sheet, scrim, grab handle, used for filters/budget/confirmations |
| **Stepper** | ±/qty control | 44px −/+ pill, mono quantity, decrement at qty 1 removes + fires Undo |
| **HoldToPay** | Press-and-hold payment | 1s hold fills pill, release cancels, disabled at 0, navigator.vibrate on done |
| **StatusBadge** | Order status indicator | Maps order states to go/warn/stop colors only |
| **BottomNav** (rebuild) | Navigation bar | 5 slots, center Scan (56px amber pill, glow), labels 11px, hides in order flow |

### Where alert()/confirm() are used (to migrate)
Search results: `alert()` and `window.confirm()` calls to replace with Snackbar/BottomSheet.
- Current code shows static/mock data — no actual alert calls visible, but likely in form submission handlers, error states, confirmations

---

## Phase 2: Screen Rebuilds — Pages to Redesign

### 2.1 Digital Menu (`/venues/[slug]/menu`)
**File:** `src/app/venues/[slug]/menu/page.tsx`
**Current state:** Basic grid of items, static cart FAB
**Changes needed:**
- Add-to-cart: 44px amber "+" → expands to Stepper at qty ≥ 1
- Row tap opens item detail BottomSheet
- Real cart state (replace hardcoded R250 total)
- Footer pill "View cart · R{total} →" (replaces FAB)
- Remove grayscale filter on food images
- Descriptions 12.5–13px sentence case
- Sticky category pills (Drinks / Food / Booths)

### 2.2 Checkout (`/venues/[slug]/checkout` — DOESN'T EXIST YET)
**File:** (needs to be created)
**Task:**
- Create `src/app/venues/[slug]/checkout/page.tsx`
- 44px back button + swipe-back
- Mono order header `ORDER #B-42 · {VENUE}`
- Line items with math `R85 × 2 · R170` in mono
- Payment method cards (emoji-free, 14px labels, amber border + check on selected)
- HoldToPay button with helper text
- Empty cart state

### 2.3 Receipt / Order Tracking (`/orders/[id]`)
**File:** `src/app/orders/[id]/page.tsx`
**Current state:** Displays mock order with stepper, QR code, ETA countdown
**Changes needed:**
- NEW receipt screen after payment (green check, "Order placed.", `ORDER #B-42 · PAID R170`)
- Pickup QR card ("Show this at fast-lane pickup.")
- Honest queue position ("3 orders ahead of you")
- DELETE fake ETA countdown (currently "04m" static)
- Skeleton loading (replace blocking "Connecting" spinner)
- Push notification + haptic on Ready status

### 2.4 Staff Dashboard (`/staff` — DOESN'T EXIST YET)
**File:** (needs to be created if not present)
**Task:**
- Create `src/app/staff/page.tsx` or similar
- Tap-to-advance buttons per card (Start → Ready → Collected, 52px primary)
- Details button 44px
- StatusBadge for wait times (go <3m, warn 3–8m, stop >8m)
- Remove hardcoded stats
- All errors via Snackbar

### 2.5 Budget (`/budget`)
**File:** `src/app/budget/page.tsx`
**Current state:** Circular progress chart, recent activity list
**Changes needed:**
- Rebuild as dark BottomSheet (title "Set your night limit.")
- Labeled input field with amber R prefix
- Quick chips R500/R1200/R2500
- "Set limit" pill CTA
- Delete white/cyan Gemini styling
- Delete fabricated "25%" stat

### 2.6 Explore / Venues (`/venues`)
**File:** `src/app/venues/page.tsx`
**Current state:** Search, filters, featured venue, venue list
**Changes needed:**
- Search full-width
- Filters/sort → BottomSheet
- Venue cards: keep real review counts only (hide "42 Reviews" if fake)
- Remove fake review counts

### 2.7 Orders View (DOESN'T EXIST YET or merged into /orders/[id])
**File:** May not exist as a list view yet
**Task:** If needed, create orders list with 2×2 stat grid, 12px labels

### 2.8 Tickets View (DOESN'T EXIST YET)
**File:** May not exist yet
**Task:** Create if needed; remove input uppercase transform; ≥12px ticket meta; ≥44px QR tap targets

---

## Phase 3: Trust, a11y, Cleanup Mapping

### Items to Remove / Strip
| Item | Locations | Action |
|---|---|---|
| Security theater copy | AuthView (not found) | Remove "AES-256 CRYPTO HANDSHAKE", "HARDWARE RESONANCE SCAN" |
| Debug menu / logo-tap auto-login | Not visible in current code | Ensure none exist in production builds |
| Role switcher | Not visible | Remove if present |
| Demo credentials | Not visible | Remove if present |
| "Terminal v2.4" / "Live Production" chips | Not visible | Remove if present |
| Fake biometric success path | AuthView (not found) | Remove simulated Face ID/fingerprint success |
| Opacity-based text (e.g., `/40`, `/50`) | Multiple pages | Replace with `--fg-2` / `--fg-3` tokens |

### Auth Views (if present)
- AuthView not found in current codebase — may need to be created or is pre-alpha

### Profile View (if present)
- ProfileView not found in current codebase — may need to be created

### Contrast & Accessibility Audit
- Verify 4.5:1 contrast small text, 3:1 large/UI
- Ensure all text ≥ 11px
- Wire browser/Android back to view state (use Next.js router)
- One avatar system (remove random Unsplash if present)

---

## Key Conflicts & Adaptations

### Conflict 1: Handoff references Vite structure, codebase is Next.js
**Resolution:** Adapt all paths:
- `src/views/` → `src/app/`
- `src/components/` stays the same
- Import paths use `@/` alias (already set up in `tsconfig.json`)

### Conflict 2: Some screens mentioned in handoff don't exist yet
**Resolution:**
- Checkout: needs to be created
- Staff dashboard: needs to be created
- Orders list view: may need to be created (separate from `/orders/[id]`)
- Tickets: may need to be created
- AuthView: may need to be created (or is pre-existing prototype)
- ProfileView: may need to be created

**Action:** Clarify with user which screens are in scope for this handoff.

### Conflict 3: No theme toggle visible in current code
**Resolution:**
- `globals.css` has `[data-theme="light"]` block ready
- `layout.tsx` needs to wire theme toggle to set `data-theme` on `<html>`
- Check if theme toggle exists elsewhere or if we need to add it

### Conflict 4: Cart state is fake (hardcoded R250 / R0)
**Resolution:**
- Phase 2.1 requires "real cart state" but no state management (Zustand, Jotai, etc.) is present
- Decision: Use local React state for cart during this phase, or note as future work?

### Conflict 5: Payment flow doesn't exist (HoldToPay, payment methods)
**Resolution:**
- Phase 2.2 (Checkout) requires HoldToPay + payment method UI
- Backend integration is out of scope (per CLAUDE.md: "no backend yet")
- Decision: Build UI with mock payment flow?

---

## Recommended Implementation Order

1. **Phase 0 (Tokens & Fonts)** — Do this first, everything else depends on it
2. **Phase 1 (Primitives)** — Build the 6 components in parallel
3. **Phase 2a (Patron flow)** — Menu → Checkout → Receipt (create missing screens)
4. **Phase 2b (Secondary screens)** — Budget, Explore, staff (if in scope)
5. **Phase 3 (Trust & a11y)** — Cleanup pass

---

## Questions for User

Before proceeding, clarify:

1. **Scope:** Which screens are in scope for this handoff? (Menu, Checkout, Receipt, Staff, Budget, Explore are clear; Orders list, Tickets, Auth, Profile are unclear)
2. **Cart state:** Should we use local React state, or is state management already set up?
3. **Theme toggle:** Is there a theme toggle button somewhere, or should we add one?
4. **Payment flow:** Should HoldToPay + payment methods be fully wired, or just UI?
5. **Backend integration:** Are we calling a backend for order status, or staying with mock data?
