# Claude Code — Copy-Paste Prompt Sequence

Setup: copy this `design_handoff_wayta_ux_update/` folder into the root of your repo, then open Claude Code in the repo. Run the prompts below **in order, one at a time**. Commit after each phase passes its checks — each phase is independently shippable.

---

## Prompt 1 — Orientation (no code changes)

```
Read design_handoff_wayta_ux_update/README.md and design_handoff_wayta_ux_update/IMPLEMENTATION_PLAN.md in full.

Then explore the codebase to map the plan onto reality: src/index.css, src/App.tsx, src/components/ (especially BottomNav, TopBar, QRScanner, OrderStatusScreen, forms/BudgetDialog) and src/views/ (ExploreView, WaytaMenu, WaytaCheckout, OrdersView, TicketsView, ProfileView, AuthView, StaffDashboardView, VendorDashboardView).

Do NOT change any code yet. Output:
1. A file-by-file mapping of each plan phase to the files it touches
2. Any conflicts between the plan and the codebase's current structure
3. Every place that uses emerald brand colors (#059669, #34d399 and friends), alert()/window.confirm(), text below 11px, or hardcoded fake data — as a checklist we'll burn down

Save this mapping to design_handoff_wayta_ux_update/MAPPING.md.
```

---

## Prompt 2 — Phase 0: Token foundation

```
Implement Phase 0 of design_handoff_wayta_ux_update/IMPLEMENTATION_PLAN.md exactly, using MAPPING.md.

1. Replace the palette in src/index.css with the token set from the plan (dark default + [data-theme="light"] block). Wire the existing theme toggle to set data-theme on <html>.
2. Swap fonts to Space Grotesk / Manrope / JetBrains Mono; remove Inter. Apply the type rules: nothing below 11px, uppercase+letter-spacing only for mono eyebrows and order codes.
3. Sweep EVERY view and component: replace emerald and all off-palette accents (purple, blue, cyan, gold shadows) with the token variables. Order states map only to --go/--warn/--stop.
4. Apply component tokens: cards (elev-1 + 1px border + 16px radius), pill CTAs ≥48px, 44px minimum touch targets, Lucide outline icons at 1.75px stroke.
5. Remove all ambient animate-pulse / animate-ping / animate-bounce; add prefers-reduced-motion support.

Money format everywhere: R prefix, no space, JetBrains Mono (R85, R860 / R1200).

When done, run the Phase 0-relevant items of the plan's acceptance checklist and show me before/after of the app in both themes.
```

---

## Prompt 3 — Phase 1: Universal primitives

```
Implement Phase 1 of design_handoff_wayta_ux_update/IMPLEMENTATION_PLAN.md: build the six shared primitives (Snackbar, BottomSheet, Stepper, HoldToPay, StatusBadge, and the rebuilt BottomNav with the center Scan slot) as reusable components under src/components/.

Match the specs in the plan precisely — sizes, radii, colors, behavior (Snackbar swipe-to-dismiss + 44px dismiss + action slot; HoldToPay measured width, 1s hold, disabled at zero, processing lock, navigator.vibrate on success; BottomNav hides inside the order flow).

Then migrate ALL existing call sites: every toast, alert(), and window.confirm() in the app goes through Snackbar or a BottomSheet confirmation. Delete the old toast implementation. Grep to prove zero alert()/confirm() calls remain.

Visual reference: design_handoff_wayta_ux_update/design_refs/ (dark + light files).
```

---

## Prompt 4 — Phase 2: Screen rebuilds

Run as **two prompts** if context gets tight (2a: patron flow, 2b: staff + secondary screens).

```
Implement Phase 2 of design_handoff_wayta_ux_update/IMPLEMENTATION_PLAN.md, in this order:

2.1 WaytaMenu — real add-to-cart (44px "+" → Stepper), live cart state, color food images, 12.5–13px sentence-case descriptions, sticky category pills, single bottom bar.
2.2 WaytaCheckout — back button + swipe-back, mono order context header, line-item math (R85 × 2 · R170), emoji-free payment cards with check indicator, HoldToPay, proper empty-cart state.
2.3 Payment success + OrderStatusScreen — new receipt screen (check, mono code, pickup QR, honest queue position), DELETE the fake ETA countdown, skeleton loading instead of the blocking spinner.
2.4 StaffDashboardView — replace HTML5 drag-and-drop with tap-to-advance status buttons per card, StatusBadge waiting times, remove hardcoded stats, Snackbar errors in plain language.
2.5 BudgetDialog — rebuild as a dark BottomSheet per spec; delete the white/cyan styling and the fabricated "25%" stat.
2.6 ExploreView, OrdersView, TicketsView — bottom-sheet filters, 2×2 stat grid, remove input uppercase transform, hide fake review counts.

Copy voice throughout: sentence case, no jargon (Pulse/Mesh/Grid/Node all gone), no emoji. Match the mockups in design_refs/ pixel-close in both themes.

Test the full patron flow at 320px and 430px widths, then run the acceptance checklist.
```

---

## Prompt 5 — Phase 3: Trust, a11y, cleanup

```
Implement Phase 3 of design_handoff_wayta_ux_update/IMPLEMENTATION_PLAN.md:

1. Strip from production: logo-tap auto-login, debug menu, role switcher, client-side demo credentials, "Terminal v2.4" / "Live Production" chips.
2. AuthView copy rewrite per the plan — remove all security theater ("AES-256 CRYPTO HANDSHAKE", "HARDWARE RESONANCE SCAN", fake terminal feed) and any simulated biometric success path.
3. Persistent labels + inputmode/autocomplete on every input (one-time-code for OTP, decimal for amounts).
4. Wire browser/Android back to the view state machine.
5. Split ProfileView: move the email inbox/compose out; one avatar system (remove the random Unsplash fallback).
6. Contrast pass: replace all opacity-based secondary text with --fg-2/--fg-3 tokens; verify 4.5:1 small / 3:1 large.

Finish by running the ENTIRE acceptance checklist from the plan against both themes and report each item pass/fail.
```

---

## Prompt 6 — Final audit (optional but recommended)

```
Act as a mobile accessibility auditor. Re-check the app against these criteria and fix anything that fails:
- No text below 11px; no uppercase sentences
- Every interactive element ≥ 44×44px
- No colors outside the token set; states only go/warn/stop
- Payment completes via hold-to-pay at 320px and 430px widths
- Staff can advance orders with taps only on a touch device
- No fake data anywhere (ETA, reviews, stats)
- Light mode correct on every screen (amber text = #b45309 on white)
- prefers-reduced-motion disables non-essential animation
```
