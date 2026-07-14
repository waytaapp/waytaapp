# Wayta — Universal Design System Update: Implementation Plan
Paste this plan (in phases, not all at once) into Google AI Studio against the `wayta-order-&-pay-throughput-engine` project. Each phase is independently shippable. Do NOT skip Phase 0 — every later phase depends on the tokens.

---

## Phase 0 — Token foundation (do first, everything inherits from this)

**Goal:** Replace the current emerald palette and ad-hoc styling with the official Wayta design tokens, applied via CSS variables so every view updates from one place.

### 0.1 Replace the palette in `src/index.css`
Delete all emerald/green brand colors (`#059669`, `#34d399`, etc.) and define:

```css
:root {
  /* Brand */
  --wayta-amber-600: #d97706;  /* primary: CTAs, active states, accents */
  --wayta-amber-500: #f97316;  /* hover on dark */
  --wayta-amber-700: #b45309;  /* press; small amber text on light */

  /* Dark (DEFAULT theme) */
  --bg-0: #0a0a0a;         /* page */
  --bg-elev-1: #171717;    /* cards */
  --bg-elev-2: #2a2a2a;    /* raised surfaces, snackbar */
  --border: #2a2a2a;
  --border-strong: #3d3d3d;
  --fg-0: #ffffff;         /* headings */
  --fg-1: #e5e5e5;         /* body */
  --fg-2: #a3a3a3;         /* secondary — passes 4.5:1 on bg-0/elev-1 */
  --fg-3: #737373;         /* captions on large text only */

  /* Semantic (both themes) */
  --go: #16a34a;   /* ready, paid, on track */
  --warn: #eab308; /* approaching limit, waiting */
  --stop: #ef4444; /* declined, over budget */

  /* Radii */
  --r-md: 12px;   /* inputs */
  --r-lg: 16px;   /* cards */
  --r-pill: 999px;/* all CTAs */

  /* Motion */
  --ease-out: cubic-bezier(0.2, 0.7, 0.1, 1);
  --dur-tap: 120ms; --dur-ui: 200ms; --dur-screen: 360ms;

  /* Glow — max ONE per screen, primary CTA only */
  --glow-amber: 0 8px 32px rgba(217, 119, 6, 0.45);
}

[data-theme="light"] {
  --bg-0: #ffffff;
  --bg-elev-1: #ffffff;   /* cards use border for elevation, not fill */
  --bg-elev-2: #f5f5f4;
  --border: #e5e5e5;
  --border-strong: #d4d4d4;
  --fg-0: #0a0a0a;
  --fg-1: #262626;
  --fg-2: #525252;
  --fg-3: #737373;
}
```

Rules:
- Dark is the default theme (nightlife). Light mode is for daytime/vendor dashboards and print.
- On light backgrounds, amber TEXT must use `--wayta-amber-700` (#b45309) for contrast; `#d97706` stays for fills/buttons (with dark-ink label `#0a0a0a`).
- Remove every other accent color in the app: no purple admin button, no blue "preparing", no gold shadows, no cyan gradients. Order states map to go/warn/stop only.
- Existing theme toggle switches `data-theme` on `<html>`; audit every view for hardcoded hex values and replace with the variables above.

### 0.2 Typography
- Fonts: **Space Grotesk** (display/headings, 700, letter-spacing -0.02em), **Manrope** (body, 400/500/600), **JetBrains Mono** (prices, order codes, timers, eyebrow labels). Remove Inter.
- **Global type floor: nothing below 11px. Ever.** Captions 12px, labels 13px, body 14–15px, section titles 17–20px, screen titles 22–28px.
- UPPERCASE + letter-spacing is ONLY allowed for mono eyebrows and order codes (`ORDER #B-42`, `LIVE AT VENUE`) — never for sentences, descriptions, nav labels, or buttons.
- Money: always `R` prefix, no space, no decimals unless cents matter, always JetBrains Mono. E.g. `R85`, `R860 / R1200`.
- Copy voice: sentence case, present tense, no emoji, no exclamation marks. Kill the invented vocabulary everywhere: Pulse→(orders/cart), Mesh→(budget/limit), Grid/Node→(delete), "Ledger interrogation failed"→"Couldn't load orders. Retry."

### 0.3 Component tokens
- Cards: `--bg-elev-1` fill + 1px `--border` + `--r-lg` + 16–24px padding. No shadows for elevation (borders only). 
- Buttons: pill radius, min-height 48px (52–56px for primary flow CTAs). Primary = amber fill + `#0a0a0a` label. Press = amber-700 + scale(0.98) over 120ms.
- **Minimum touch target 44×44px on EVERY interactive element** — steppers, toggles, chips, dismiss buttons, list rows.
- Icons: Lucide, outline only, 1.75px stroke. Amber when active, `--fg-2` inactive.
- Respect `prefers-reduced-motion`; remove all ambient `animate-pulse`/`animate-ping`/`animate-bounce` (allowed: one meaning only — live order activity indicator).

---

## Phase 1 — Universal primitives (build once, use everywhere)

1. **`<Snackbar>`** — replaces the toast system AND every `alert()` / `window.confirm()` in the app (OrdersView, ProfileView, StaffDashboardView, TicketsView). Bottom-anchored above the nav, `--bg-elev-2` solid surface, 13.5px sentence case, optional action button (e.g. Undo), 44px dismiss, swipe-to-dismiss, duration scaled to length. Neutral titles — never "Security Blocked"/"Access Paused".
2. **`<BottomSheet>`** — dark sheet, grab handle, scrim `rgba(0,0,0,0.7)` + 8px blur. Used by: filters/sort (replacing native selects + dropdown menu), budget dialog, item detail, destructive confirmations.
3. **`<Stepper>`** — 44px − / + in a pill, mono quantity. Decrement at qty 1 removes the item AND fires an Undo snackbar.
4. **`<HoldToPay>`** — replaces slide-to-pay. Full-width pill; press-and-hold 1s fills the pill left→right (width measured, not hardcoded); release cancels; disabled when total is 0; locks with a processing state; medium haptic (`navigator.vibrate`) on completion. This is also the WCAG 2.5.7 single-pointer fix.
5. **`<StatusBadge>`** — one component mapping order states to go/warn/stop. Delete all per-view status colors.
6. **`<BottomNav>` rebuild** — 5 slots with the **Scan action in the raised center slot** (56px amber circle, the screen's one glow). Labels 11px Manrope sentence case; active amber, inactive `--fg-2` at full opacity. Nav HIDES inside the order flow (menu → checkout → receipt), where the cart pill / pay CTA is the only bottom element. Remove the scroll-triggered floating scan button and the top-of-page scan banner.

---

## Phase 2 — Screen rebuilds (in revenue-path order)

### 2.1 Menu (`WaytaMenu`)
- Add-to-cart on every row: 44px amber "+" → expands to `<Stepper>` at qty ≥ 1. Row tap opens item detail `<BottomSheet>`.
- Real cart state (remove hardcoded R250 total); footer pill shows live `View cart · R{total} →`.
- Remove grayscale filter from food images; warm dominant-color placeholder while loading.
- Descriptions: 12.5–13px Manrope sentence case ("White rum, mint, lime soda.").
- Sticky category pills (44px, scroll-spy): Drinks / Food / Booths.

### 2.2 Checkout (`WaytaCheckout`)
- 44px back button (←) top-left + swipe-back; cart survives navigation.
- Header shows mono order context: `ORDER #B-42 · {VENUE}`.
- Line items show unit math: `R85 × 2 · R170` in mono.
- Payment methods: two 56px cards, 14px labels, real icons (no emoji), selected = 1.5px amber border + amber check dot.
- `<HoldToPay>` with helper text "Press and hold for 1 second. Release to cancel."
- Empty cart: proper empty state ("Your cart is empty" + Browse menu button); pay control hidden.

### 2.3 Payment success + tracking (`OrderStatusScreen`)
- New receipt screen after payment (no timeout redirect): green check, "Order placed.", mono `ORDER #B-42 · PAID R170`, pickup QR card "Show this at fast-lane pickup.", honest queue position ("3 orders ahead of you"), Track my order button.
- **Delete the fake ETA countdown.** Show vendor-driven state + queue position only. Push notification + success haptic when state flips to Ready.
- Loading: skeleton of the status card (shimmer), never the blocking "Connecting to bar..." spinner.

### 2.4 Staff board (`StaffDashboardView`)
- Replace HTML5 drag-and-drop with **tap-to-advance**: each card gets one 52px primary button cycling Start preparing → Mark ready → Collected, plus a 44px Details button. Keep drag as desktop-only enhancement.
- Waiting time as a `<StatusBadge>` (go <3m, warn 3–8m, stop >8m) instead of pinging red dots.
- Remove hardcoded stats (142 serviced / 3m 12s); show real data or "Not enough data yet."
- All errors through `<Snackbar>` in plain language.

### 2.5 Budget (`BudgetDialog` → BottomSheet)
- Rebuild as dark `<BottomSheet>`: title "Set your night limit.", labeled field with amber `R` prefix (`inputmode="decimal"`), 44px quick chips R500/R1200/R2500, pill CTA "Set limit".
- Delete the white/cyan Gemini styling and the fabricated "25% better night satisfaction" stat.

### 2.6 Explore, Orders, Tickets
- Explore: search full-width; filters/sort → `<BottomSheet>`; venue cards keep real review counts only (hide "42 Reviews" until data exists); budget chip becomes a clearly tappable pill or moves to Profile.
- Orders: stat cards 2×2 grid (never 4-across on mobile), 12px labels; header "Your orders".
- Tickets: remove uppercase transform from the search INPUT value; ticket meta ≥12px; QR thumbnails ≥44px tappable.

---

## Phase 3 — Trust, a11y and cleanup pass

1. Strip from production UI: hidden logo-tap auto-login, debug menu, role-switcher, demo credentials, "Terminal v2.4" / "Live Production • v1.0" chips.
2. Auth copy rewrite: one screen one question ("Order faster. Skip the line." → I'm here to order / I run a venue). Remove "AES-256 SECURED CRYPTO HANDSHAKE", "HARDWARE RESONANCE SCAN", the fake terminal feed, and ANY simulated biometric success — say plainly "Protected by your device's Face ID / fingerprint" only when true.
3. Forms: persistent labels on all inputs (no placeholder-only), `inputmode`/`autocomplete` attributes (OTP: `one-time-code`; email; decimal for amounts).
4. Wire browser back / Android back to the view stack (history integration for the manual navigation state machine).
5. Split Profile: move the email inbox/compose OUT of Profile; keep wallet, payment methods, settings. One avatar system (remove random Unsplash fallback).
6. Contrast audit: replace all opacity-based secondary text (`/40`, `/50`, `/60`, `opacity-50`) with `--fg-2`/`--fg-3` tokens; verify 4.5:1 small text, 3:1 large/UI.

---

## Acceptance checklist (run after each phase)
- [ ] No text below 11px anywhere; no uppercase sentences
- [ ] No hex colors outside the token set; order states only go/warn/stop
- [ ] Every tap target ≥ 44px (test steppers, chips, dismiss buttons)
- [ ] No `alert()` / `confirm()` calls remain
- [ ] Payment completes via press-and-hold on 320px and 430px wide viewports
- [ ] Staff can advance an order using only taps on a touchscreen
- [ ] No fake data: ETA, reviews, stats, satisfaction claims
- [ ] Light mode: flip `data-theme="light"` and verify every screen (amber text = #b45309 on white)
- [ ] `prefers-reduced-motion` disables all non-essential animation
