# Wayta – CLAUDE.md

This file is the authoritative guide for AI assistants working in this repository. Read it fully before touching any code.

---

## Project Overview

**Wayta** is a South African nightlife order-and-pay mobile application. Patrons at clubs, bars, and festivals use it to:

- Discover nearby venues and events
- Pay for express entry / cover charges via QR code
- Browse a digital menu and place F&B orders
- Track order status in real time
- Manage a nightly budget
- Find friends on a live venue map
- Book VIP tables

The repository currently contains:
1. A **Next.js 16 web prototype** (`wayta-app/`) — the living, buildable implementation
2. **44 HTML/screenshot UI design prototypes** — pixel-accurate reference screens for all app flows
3. **Architecture and blueprint docs** — technical decisions, schema, roadmap

---

## Repository Layout

```
waytaapp/
└── stitch_wayta_nightlife_order_pay/
    ├── wayta-app/                         ← Next.js application (BUILD TARGET)
    ├── wayta_development_blueprint.md     ← Tech stack, schema, UX flow, MVP roadmap
    ├── wayta_technical_architecture_document.md  ← Concurrency, POPIA, payment adapters
    ├── <44 prototype screen directories>  ← HTML + screenshot for each UI screen
    └── wayta_*.html (×10)                 ← Full-flow HTML prototypes
```

All active development happens inside `stitch_wayta_nightlife_order_pay/wayta-app/`.

### Prototype Screen Directories (reference only – do not modify)

| Directory | Screen |
|---|---|
| `welcome_to_wayta` / `welcome_loading_state` / `welcome_error_state` / `welcome_terms_modal` | Onboarding |
| `intro_find_your_crew` / `intro_skip_the_queue` / `intro_track_your_night` | Feature intros |
| `venue_discovery` / `venue_discovery_list` / `venue_selection_list` | Venue browsing |
| `venue_details_black_door_1` / `venue_details_black_door_2` | Venue detail page |
| `digital_menu` | In-venue menu |
| `order_tracking` | Live order tracker |
| `vip_reservations` | Table booking |
| `budget_dashboard` / `set_a_budget` / `set_a_budget_form` | Budget management |
| `transaction_history` / `refined_transaction_history` / `mobile_transaction_history` | Spend history |
| `wayta_social_map` / `intro_find_your_crew` | Friend location map |
| `user_profile` | Profile screen |
| `safety_center` | Safety features |
| `revenue_dashboard` / `venue_manager_dashboard` / `venue_manager_mobile_dashboard` | Venue operator views |
| `staff_management_dashboard` / `staff_roster_mobile` | Staff management |
| `main_navigation_drawer` | App navigation |
| `loading_ethereal_flow_variant` / `loading_glitch_pulse_variant` / `electric_daybreak` | Branded loading screens |
| `wayta_nightlife_app_flow_1` / `wayta_nightlife_app_flow_2` | Full app flow prototypes |
| `wayta_festival_budget_and_venue_app` | Festival-mode prototype |
| `experimental_nightlife_system` | Experimental feature exploration |

---

## Next.js Application (`wayta-app/`)

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5.x (strict mode) |
| UI Library | React 19.2.4 |
| Styling | Tailwind CSS 4.x |
| Icons | Material Symbols Outlined (Google Fonts variable icon font) |
| Fonts | Inter (body), Spline Sans (display/headings) |
| Linting | ESLint 9.x with `eslint-config-next` |

### Directory Structure

```
wayta-app/
├── src/
│   └── app/
│       ├── layout.tsx          ← Root layout: fonts, metadata, Material Symbols link
│       ├── page.tsx            ← Home page / dev navigation
│       ├── globals.css         ← Tailwind import + Wayta design tokens
│       └── orders/
│           └── [id]/
│               └── page.tsx    ← Order tracking screen (async server component)
├── public/                     ← Static SVG assets (default Next.js set)
├── package.json
├── tsconfig.json               ← ES2017 target, strict, path alias @/* → ./src/*
├── next.config.ts              ← Minimal – default config
├── postcss.config.mjs          ← @tailwindcss/postcss plugin
└── eslint.config.mjs           ← next/core-web-vitals + typescript
```

### Implemented Pages

| Route | File | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | Dev landing with link to sample order |
| `/orders/[id]` | `src/app/orders/[id]/page.tsx` | Order tracking UI (fully styled, static data) |

All other screens (menu, venue discovery, budget, VIP, etc.) exist only as HTML prototypes – they are **not yet implemented** in the Next.js app.

---

## Design System

### Color Tokens (`globals.css`)

All tokens are CSS custom properties and must be consumed via Tailwind's theme utility classes, not hardcoded hex values.

| Token | Tailwind class | Value | Usage |
|---|---|---|---|
| `--background` | `bg-background` | `#fcf8f8` | Page background |
| `--on-background` | `text-on-background` | `#1c1b1b` | Default text |
| `--surface` | `bg-surface` | `#fcf8f8` | Component surface |
| `--surface-container` | `bg-surface-container` | `#f0edec` | Cards |
| `--surface-container-low` | `bg-surface-container-low` | `#f6f3f2` | Subtle card variant |
| `--surface-variant` | `bg-surface-variant` | `#e5e2e1` | Input backgrounds |
| `--primary` | `text-primary` / `bg-primary` | `#5f6300` | Primary brand (olive) |
| `--primary-container` | `text-primary-container` | `#f6ff00` | Accent yellow-green |
| `--secondary` | `text-secondary` | `#a90097` | Secondary (magenta) |
| `--secondary-container` | `text-secondary-container` | `#d300bd` | Secondary accent |
| `--outline-variant` | `border-outline-variant` | `#c9c8aa` | Subtle borders |

The dark-themed order tracking screen uses inline `bg-black`, `bg-zinc-*`, and `text-cyan-400` (approximately `#00f0ff`) for the nightclub aesthetic. Future dark-mode tokens should be added to `globals.css` under a `[data-theme="dark"]` selector or a `@media (prefers-color-scheme: dark)` block.

### Typography

- `font-sans` → Inter (body copy, UI text)
- `font-display` → Spline Sans (headings, brand wordmark)
- Available weights for Spline Sans: 300, 400, 500, 600, 700

### Icons

Use Material Symbols Outlined exclusively. Render with:

```tsx
<span className="material-symbols-outlined">icon_name</span>
```

The variable font is loaded in `layout.tsx` via a `<link>` tag. Do not install an npm icon package – the CDN font already covers the full icon set.

---

## Development Workflow

### Prerequisites

- Node.js ≥ 18
- npm

### Commands

Run from `stitch_wayta_nightlife_order_pay/wayta-app/`:

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (webpack mode, http://localhost:3000)
npm run build        # Production build
npm start            # Serve production build
npm run lint         # ESLint check
```

The `--webpack` flag is intentional on `dev` (explicit webpack bundler selection for Windows compatibility).

### TypeScript

- Strict mode is enabled – no `any` without justification
- Path alias `@/*` resolves to `./src/*`
- `noEmit: true` – TypeScript is type-check only; Next.js handles compilation

### Adding New Pages

Follow the App Router convention:

```
src/app/<route>/page.tsx      ← Server Component by default
src/app/<route>/layout.tsx    ← Optional per-route layout
```

Use async Server Components when fetching data. Add `"use client"` only when interactivity, browser APIs, or React hooks are required.

---

## Product Data

The CSV `Scanner__Products_Type.csv` (uploaded reference) defines the initial product catalogue for four venues:

| Venue | ID Prefix | Example Products |
|---|---|---|
| Sumo | `SM-BR1*` | Beers, Ciders, Bourbon, Cognac, Spirits, Tequilas, Vodkas, Whiskeys, Mixers, Ice |
| Taboo | `TB-BR1*` | Same categories as Sumo |
| Montana | `MT-BR1*` | Same categories |
| Black Door | `BD-BR1*` | Same categories |

Product fields: `Venue Name`, `Product ID`, `Budget Category`, `Product Type`, `Product Name`, `Product Description`, `Price` (ZAR), `Image`.

All prices are in South African Rand (ZAR). Prices follow the `R<amount>.00` format.

The `importsampleEcwid.csv` is an Ecwid-format product import sample included for reference on how to structure e-commerce product data with SEO fields, shipping dimensions, and stock quantities.

---

## Order Capture Flow

The app captures orders from a patron's device through to the bar/venue:

1. Patron selects products from the digital menu
2. App validates against the patron's nightly budget
3. Payment is processed (Peach Payments / PayFast / Stitch)
4. Order is created with status `Received`
5. Venue staff see the order on their tablet dashboard
6. Staff update status to `Preparing` → `Ready`
7. Push notification sent to patron
8. Patron shows QR code at collection counter
9. Staff scan QR code to confirm collection → status `Collected`

The QR code is displayed on the order tracking screen (`/orders/[id]`) and is used at pickup.

---

## Planned Backend Architecture

**This is not yet implemented.** The following is the target architecture from `wayta_development_blueprint.md`:

### Tech Stack (Backend)

| Layer | Technology |
|---|---|
| API | Node.js + NestJS + TypeScript |
| Primary DB | PostgreSQL (Supabase or AWS RDS) |
| Cache / Real-time state | Redis |
| Real-time push | Socket.io or MQTT |
| Payments (SA) | Peach Payments, PayFast, Stitch (stitch.money) |
| Mobile wallets | Apple Pay / Google Pay via payment provider SDK |
| Infrastructure | AWS Cape Town (af-south-1) |
| Mobile client | Flutter (future – not in this repo) |

### Core Database Schema

```sql
Users        (id UUID, name, email, phone, budget_limit DECIMAL, current_location POINT)
Venues       (id UUID, name, type, location POINT, is_active BOOL)
Products     (id UUID, venue_id FK, name, price, category, stock_status)
Orders       (id UUID, user_id FK, venue_id FK, items JSONB, total_amount DECIMAL, status)
Transactions (id UUID, order_id FK, payment_gateway_ref, status)
```

Order statuses: `Received` → `Preparing` → `Ready` → `Collected`

### Performance & Concurrency

- **Optimistic UI**: Local state updates first, synced to server in background
- **Offline queue**: SQLite/Hive local storage with exponential-backoff retry
- **Data payloads**: Protobuf or minified JSON to minimise bytes in low-signal venues
- **VIP table booking**: Pessimistic locking (`SELECT … FOR UPDATE`) to prevent double-booking
- **DB indexes**: GIST on `venues.location`, B-tree on `orders(user_id, created_at)`, filtered index on `tables(venue_id, status)`

### South Africa Compliance (POPIA)

- Data stored in **AWS af-south-1** (Cape Town) for data locality
- Explicit opt-in required for location sharing and marketing
- PII encrypted at rest with AES-256
- Payment gateway uses a modular adapter pattern – swap providers without app changes

---

## MVP Roadmap

| Sprint | Focus |
|---|---|
| Sprint 1 | Auth (Phone OTP), venue/event listing with geolocation, static menu display |
| Sprint 2 | Peach Payments / PayFast integration, entry ticket purchase, QR code generation |
| Sprint 3 | Cart, checkout, real-time order status via WebSockets, bartender/venue UI |
| Sprint 4 | "Find my friends" (opt-in location), budget tracker dashboard, low-signal optimisation |

---

## Key Conventions

1. **No inline hex values** – use design token Tailwind classes from `globals.css`
2. **Server Components by default** – only add `"use client"` when you need hooks or browser APIs
3. **Icons via Material Symbols** – `<span className="material-symbols-outlined">name</span>`
4. **Fonts via CSS variables** – `font-sans` (Inter) and `font-display` (Spline Sans)
5. **Strict TypeScript** – no implicit `any`; define prop types explicitly
6. **No test framework yet** – add tests in `__tests__/` or co-located `*.test.tsx` files when introducing one
7. **No backend yet** – all data is currently static/hardcoded; use mock data until the NestJS backend exists
8. **Currency** – always use South African Rand (ZAR / R) for prices
9. **Prototype screens are reference only** – do not modify HTML files in prototype directories; implement features in `wayta-app/`
10. **Path imports** – use `@/` alias for all imports within `src/`

---

## Git & Branch Strategy

- Development branch: `claude/claude-md-docs-hjwqnv`
- Remote: `waytaapp/waytaapp` on GitHub
- Commits should be descriptive and scoped (e.g. `feat(orders): add real-time status polling`)
- No CI/CD is configured yet – runs and lint checks are manual

---

## External References

- Architecture doc: `stitch_wayta_nightlife_order_pay/wayta_technical_architecture_document.md`
- Dev blueprint: `stitch_wayta_nightlife_order_pay/wayta_development_blueprint.md`
- Product catalogue (CSV): `Scanner__Products_Type.csv` (uploaded reference)
- Stitch payments: stitch.money
- POPIA: South Africa's Protection of Personal Information Act (analogous to GDPR)
