# Handoff: Wayta Universal Design System Update (Amber/Ink, Dark + Light)

## Overview
This package implements the findings of a full mobile UX audit of the Wayta Order & Pay PWA. It migrates the app from its current ad-hoc emerald styling to the official Wayta design system (amber #d97706 on ink, Space Grotesk / Manrope / JetBrains Mono), applied **universally via CSS tokens**, and rebuilds the highest-friction screens: menu add-to-cart, checkout hold-to-pay + receipt, staff tap-to-advance, a unified snackbar/bottom-sheet feedback system, and a readable bottom nav with a center Scan slot. Includes a full light mode via `data-theme="light"`.

## About the Design Files
The files in `design_refs/` are **design references created in HTML** — they show intended look and behavior, they are NOT production code to copy. The task is to **recreate these designs inside the existing codebase** (React + Vite + Tailwind, `src/` with `views/` and `components/`) using its established patterns. Open the `.dc.html` files in a browser (keep `support.js` next to them) or view them in the original design project.

- `Wayta UX Audit.dc.html` — the audit report: every finding, annotated on screen recreations. Read this to understand WHY each change exists.
- `Wayta UX Fixes — After (dark).dc.html` — target designs, dark mode (default theme).
- `Wayta UX Fixes — Light Mode.dc.html` — the same targets in light mode + light-token rules.

## Fidelity
**High-fidelity.** Colors, type sizes, spacing, radii, and copy in the "After" mockups are final — recreate them precisely using the token variables defined in `IMPLEMENTATION_PLAN.md` Phase 0. Layout containers may adapt to the codebase's existing structure.

## Where everything is specified
`IMPLEMENTATION_PLAN.md` in this folder is the single source of truth. It contains:
- **Phase 0** — the complete token set (CSS custom properties, dark default + `[data-theme="light"]` block), typography rules, copy voice, component tokens, touch-target and motion rules
- **Phase 1** — shared primitives to build once: Snackbar, BottomSheet, Stepper, HoldToPay, StatusBadge, BottomNav
- **Phase 2** — per-screen rebuild specs in revenue-path order (menu, checkout, receipt/tracking, staff board, budget, explore/orders/tickets)
- **Phase 3** — trust/a11y cleanup (remove dev shortcuts, fake data, security theater; form labels; browser back; contrast pass)
- **Acceptance checklist** — run after every phase

`PROMPTS.md` is the copy-paste prompt sequence for Claude Code — run the prompts in order, one at a time.

## Key design tokens (summary — full set in IMPLEMENTATION_PLAN.md)
- Primary: `#d97706` (hover `#f97316`, press `#b45309`); amber **text** on light backgrounds uses `#b45309`
- Dark surfaces: page `#0a0a0a`, cards `#171717`, raised `#2a2a2a`, borders `#2a2a2a`/`#3d3d3d`
- Light surfaces: page/cards `#ffffff` (elevation by 1px border, not fill), raised `#f5f5f4`, borders `#e5e5e5`/`#d4d4d4`
- Text dark: `#ffffff` / `#e5e5e5` / `#a3a3a3`; light: `#0a0a0a` / `#262626` / `#525252`
- Semantic: go `#16a34a`, warn `#eab308` (text on white: `#854d0e`), stop `#ef4444` — the ONLY state colors
- Fonts: Space Grotesk (display, 700, −0.02em), Manrope (body), JetBrains Mono (prices `R85`, codes `ORDER #B-42`, eyebrows)
- Radii: inputs 12px, cards 16px, ALL CTAs pill; touch targets ≥ 44px; type floor 11px
- One amber glow (`0 8px 32px rgba(217,119,6,.45)`, light mode .35) per screen, primary CTA only
- Motion: `cubic-bezier(0.2,0.7,0.1,1)`, 120/200/360ms; respect `prefers-reduced-motion`; no ambient pulse/ping/bounce
- No emoji. Sentence case. Uppercase+tracking only for mono eyebrows/order codes.

## Assets
No bitmap assets are bundled. Icons: Lucide (outline, 1.75px stroke) — already conceptually aligned; brand marks live in the team's own asset library.

## Files
```
design_handoff_wayta_ux_update/
├── README.md                  ← you are here
├── IMPLEMENTATION_PLAN.md     ← full phased spec (source of truth)
├── PROMPTS.md                 ← copy-paste sequence for Claude Code
└── design_refs/
    ├── Wayta UX Audit.dc.html
    ├── Wayta UX Fixes — After (dark).dc.html
    ├── Wayta UX Fixes — Light Mode.dc.html
    └── support.js             ← runtime needed to open the .dc.html files
```
