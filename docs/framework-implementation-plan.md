# Wayta — GCP Framework Implementation Plan

How to get from the provisioned GCP framework (`infra/gcp/`) to a running
order-and-pay SaaS. Written against the architecture in
`stitch_wayta_nightlife_order_pay/wayta_development_blueprint.md` and
`wayta_technical_architecture_document.md`.

---

## Where things actually stand

| Layer | State |
|---|---|
| Infrastructure | Terraform module written & validated, **never applied** (`infra/gcp/`) |
| Backend API | **Does not exist.** No NestJS service, no repo, no Dockerfile |
| Database | **Not provisioned.** No Cloud SQL in the Terraform at all |
| Frontend | Next.js app with 10+ screens — **100% client-side `localStorage`** |
| Payments | Not integrated |
| Auth | Identity Platform provisioned; no client wiring, no phone OTP |

The frontend is further along than `CLAUDE.md` documents: `venues/`, `menu/`,
`checkout/`, `orders/`, `budget/`, `staff/` routes all exist with working cart
and order-status flows. All state lives in `localStorage` via
`src/hooks/use-local-storage.ts` and `src/lib/{cart,orders,menu,venues}.ts`.
That is the migration surface — those five files are where the API client
replaces browser storage.

---

## Three decisions that block everything downstream

These change infrastructure that **cannot be migrated in place** later. Resolve
before `terraform apply`.

### D1 — Region vs. POPIA data locality ⚠️

`infra/gcp/variables.tf` defaults to `europe-west2` (London), BigQuery to `EU`.
The architecture doc mandates South African data locality for POPIA
(it specifies AWS `af-south-1`). GCP's equivalent is **`africa-south1`
(Johannesburg)**.

This matters because Cloud SQL, Memorystore, and BigQuery datasets **cannot
change region after creation** — fixing it later means rebuilding the stack and
migrating data.

Complication: `africa-south1` is a newer region and does not carry the full
service catalogue. Vertex AI Vector Search in particular is not available in
every region. **Verify current availability** for Cloud SQL, Memorystore Redis,
Vertex AI Vector Search, and Serverless VPC Access at
`cloud.google.com/about/locations` before committing.

Recommended shape — a split, if the verification confirms the gap:
- **`africa-south1`**: Cloud SQL, Memorystore, Cloud Run, BigQuery — everything
  touching PII or transactions.
- **Elsewhere**: Vertex AI only, on de-identified embeddings (no names, phones,
  or payment refs in the vectors), documented in a DPIA.

If POPIA counsel requires *all* processing in-country, the AI feature waits for
regional availability. That is a product decision, not a technical one.

### D2 — No PostgreSQL exists in the framework

The blueprint's entire schema — Users, Venues, Products, Orders, Transactions —
is PostgreSQL. The Terraform provisions Redis, BigQuery, Pub/Sub, and Vertex AI,
but **no Cloud SQL instance**. Nothing can persist an order today.

This is the single largest gap and Phase 1 is mostly closing it.

### D3 — Payment gateway mismatch

`infra/gcp/pubsub.tf` creates a `stripe-events-topic`. The blueprint specifies
**Peach Payments, PayFast, or Stitch** — the SA-market gateways that handle ZAR
settlement to South African merchant accounts and instant EFT, which Stripe does
not serve well for SA entities.

Keep the Pub/Sub webhook-intake pattern; it is gateway-agnostic and correct.
Rename the topic and build to the modular adapter pattern the architecture doc
already calls for. Pick the primary gateway before Phase 4.

---

## Phase 1 — Complete the platform

**Goal:** infrastructure that can actually host a stateful application.
**Depends on:** D1, D2.

1. **Add Cloud SQL for PostgreSQL** — new `infra/gcp/cloudsql.tf`.
   - Private IP only, on the existing `google_compute_network.app_vpc`
     (`network.tf`), reachable through the VPC connector already wired into
     Cloud Run.
   - Enable `sqladmin.googleapis.com` in the `local.required_services` list in
     `apis.tf`.
   - PostGIS extension for the `idx_venues_location` GIST index the
     architecture doc requires for venue proximity search.
   - Automated backups + PITR. Start `db-g1-small`; size up under load testing.
   - Adds roughly $50–90/month to the ~$50 idle baseline in the infra README.
2. **Secret Manager** for gateway keys, DB credentials, and the Identity
   Platform API key. Grant the runtime SA (`google_service_account.web_app`)
   `roles/secretmanager.secretAccessor`. No secrets in env vars or tfvars.
3. **Grant the runtime service account its roles** — the infra README's
   post-apply checklist lists these but Terraform does not yet apply them:
   `roles/cloudsql.client`, `roles/pubsub.publisher`,
   `roles/bigquery.dataEditor`, `roles/aiplatform.user`,
   `roles/errorreporting.writer`.
4. **Remote state** — create the GCS bucket and uncomment the `backend "gcs"`
   block in `versions.tf` before the first real apply. Local state on an
   ephemeral container is how you lose an environment.
5. **CI/CD** — Cloud Build 2nd-gen GitHub connection → build container → push to
   the Artifact Registry repo from `cloud_run.tf` → `gcloud run deploy`. The
   service already has `ignore_changes` on the image so deploys and
   `terraform apply` do not fight.

**Done when:** `terraform apply` succeeds end to end; a placeholder container
on Cloud Run opens a TCP connection to Cloud SQL and `PING`s Redis over the VPC
connector.

---

## Phase 2 — Backend API

**Goal:** a NestJS service on Cloud Run that owns all state.
**Depends on:** Phase 1.

Lives in a new `services/api/` directory in this repo (monorepo) — the frontend
and API share the order-status enum and money handling, and splitting repos
this early costs more than it saves.

1. **Scaffold** NestJS + TypeScript, multi-stage Dockerfile, health check at
   `/healthz` for Cloud Run startup probes.
2. **Schema & migrations** — Prisma or TypeORM, modelling the blueprint's five
   tables verbatim. Include the three indexes from the architecture doc:
   GIST on `venues.location`, B-tree on `orders(user_id, created_at)`,
   filtered index on `tables(venue_id, status)`.
   **Money as `NUMERIC(10,2)`, never float** — the frontend currently uses JS
   numbers for ZAR totals in `src/lib/cart.ts`, which will drift by cents.
3. **Auth** — Identity Platform phone OTP (matches Sprint 1 in the blueprint).
   Verify the Firebase ID token in a NestJS guard; map `firebase_uid` → `Users`
   row. `identity_platform.tf` currently enables **email/password only** —
   add the phone provider.
4. **Seed data** — import `Scanner__Products_Type.csv` (Sumo, Taboo, Montana,
   Black Door) into `Venues` + `Products`, replacing the hardcoded arrays in
   `src/lib/venues.ts` and `src/lib/menu.ts`.
5. **Endpoints** — venues (with geo-radius), menu, orders (create/get/list),
   budget, order status transitions.
6. **Port the budget check server-side.** The blueprint's `processOrder` logic
   must run in the API, inside the same transaction as order creation. Client-
   side budget enforcement (today's `src/lib/budget.ts`) is advisory only —
   trivially bypassed.

**Done when:** an order survives `POST /orders` → Cloud SQL → `GET /orders/:id`,
and exceeding the nightly budget returns 403 from the server.

---

## Phase 3 — Frontend migration

**Goal:** Next.js reads and writes the API instead of `localStorage`.
**Depends on:** Phase 2.

Migrate behind a thin data layer so screens barely change: keep the existing
function signatures in `src/lib/orders.ts` and `src/lib/cart.ts`, swap their
bodies from `localStorage` to `fetch`. The React components calling them
(`menu-client.tsx`, `checkout-client.tsx`, `venues-client.tsx`) stay as-is.

Preserve the offline-first behaviour the architecture doc demands — this is a
nightclub app on congested venue wifi:
- **Optimistic UI** — cart and status changes render locally first.
- **Write queue** — retain `localStorage` as an outbox with exponential-backoff
  retry, not as the source of truth.
- **Idempotency keys** on order creation, so a retry after a dropped response
  does not double-charge.

**Done when:** two devices signed into the same account see the same order
history, and an order placed in airplane mode syncs on reconnect exactly once.

---

## Phase 4 — Payments & entry QR

**Depends on:** Phase 2, D3. Maps to blueprint Sprint 2.

1. **Gateway adapter interface** (`charge`, `refund`, `verifyWebhook`) with the
   chosen SA provider as first implementation — the modular pattern from the
   architecture doc, so switching providers is one class.
2. **Webhook intake** — provider posts to a Cloud Run endpoint that verifies the
   signature, publishes to the Pub/Sub topic, and returns 200 immediately.
   Processing happens off the worker subscription, with the dead-letter topic
   from `pubsub.tf` catching poison messages.
3. **Transactions table** written in the same DB transaction as order status.
   Never trust a client-reported payment success.
4. **QR generation** for express entry and collection — signed, short-TTL
   payloads so a screenshot cannot be reused. The `/orders/[id]` screen already
   has the display slot.

**Done when:** a sandbox payment moves an order `Received` → paid, a replayed
webhook is idempotent, and a scanned collection QR flips status to `Collected`.

---

## Phase 5 — Real-time order status

**Depends on:** Phase 2. Maps to blueprint Sprint 3.

Cloud Run supports WebSockets, but connections are capped by request timeout
(60 min max) and billed for their full duration — worth knowing before choosing
Socket.io as the blueprint suggests.

Two viable paths:
- **Socket.io on Cloud Run**, with Redis (already provisioned) as the pub/sub
  adapter across instances. Matches the blueprint. Reconnection logic required.
- **Firestore listeners** for the status document — no connection management,
  works well offline, but adds a datastore alongside Cloud SQL.

Recommend Socket.io + Redis: Redis is already in the framework and paid for,
and it keeps a single source of truth. Ship the staff dashboard
(`src/app/staff/page.tsx`) against it — bartenders advancing
`Received → Preparing → Ready` is what makes the patron screen live.

---

## Phase 6 — Analytics & the AI feature

**Depends on:** Phase 3.

**Analytics:** event stream from the API → Pub/Sub → BigQuery `app_analytics`
dataset (already provisioned in `bigquery.tf`). Note
`analytics_table_expiration_ms` defaults to `null` (never expire) — set a
retention window deliberately, since POPIA expects data minimisation.

**The AI feature needs a defined purpose.** Vertex AI Vector Search is
provisioned but no use case is specified anywhere in the repo. The index and
endpoint exist; nothing is deployed to the endpoint, which is correct — a
deployed index runs always-on nodes at **$500+/month**, an order of magnitude
above the rest of the stack combined.

Do not deploy it until a specific feature justifies it. Plausible candidates,
cheapest first:
1. **Semantic menu search** ("something fruity, not too strong") — modest
   corpus, real patron value.
2. **Venue/event recommendations** from history and location.
3. **Order-pattern insight** for venue operators.

For (1), a corpus of a few thousand products may not need vector search at all —
Postgres full-text search or `pg_trgm` costs nothing extra and is already in
Phase 1. Benchmark that first; escalate to Vector Search only if it is
demonstrably insufficient.

---

## Phase 7 — Production readiness

- **POPIA**: explicit opt-in for location sharing (the "find my crew" feature),
  data subject access/deletion endpoints, PII encryption at rest, retention
  policy, DPIA covering any cross-region AI processing from D1.
- **Load testing** against realistic patterns: a venue is near-idle then takes
  200 orders in ten minutes at last call. Tune `cloud_run_max_instances`
  (default 10 — likely too low for peak) and Cloud SQL sizing against measured
  behaviour.
- **Concurrency**: VIP table booking needs the pessimistic `SELECT … FOR UPDATE`
  from the architecture doc. Verify under concurrent load that double-booking
  is impossible.
- **Observability**: structured logs to Cloud Logging, Error Reporting wired in
  the API, alerting on order-failure rate and payment webhook lag.
- **Cost guardrails**: budget alerts before launch. The infra README's idle
  estimate (~$50/month) does not include Cloud SQL, and rises sharply if the
  vector index is ever deployed.

---

## Sequencing

```
D1, D2, D3  ─────────────────────────────► decide first
     │
     ▼
Phase 1  Platform (Cloud SQL, secrets, IAM, CI/CD)
     │
     ▼
Phase 2  Backend API  ──┬──► Phase 4  Payments & QR
     │                  └──► Phase 5  Real-time status
     ▼
Phase 3  Frontend migration
     │
     ▼
Phase 6  Analytics & AI  ──► Phase 7  Production readiness
```

Phases 4 and 5 run parallel to 3 once the API contract is stable. Phase 6's AI
half can be dropped entirely without affecting anything else — treat it as
optional scope, not a dependency.

## Mapping to the blueprint's sprints

| Blueprint sprint | Phases here |
|---|---|
| Sprint 1 — Auth, discovery, static menu | 1, 2, 3 |
| Sprint 2 — Payments, ticketing, QR | 4 |
| Sprint 3 — Cart, checkout, live status, venue UI | 5 (+ 3) |
| Sprint 4 — Social, budget, low-signal | 3 (offline), 6, 7 |

The blueprint's four sprints assume a backend already exists. Phases 1 and 2
are the unbudgeted work that precedes Sprint 1.
