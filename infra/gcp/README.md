# GCP Infrastructure — Terraform

Terraform configuration that migrates the SaaS stack from third-party tools to
Google Cloud native services, ready for a Google AI Studio / Gemini-powered app.

## Component mapping

| Third-Party Tool | GCP Native Equivalent | Terraform file |
|---|---|---|
| Vercel | Cloud Run (+ Artifact Registry) | `cloud_run.tf` |
| Namecheap | Cloud Domains | `dns_domains.tf` |
| Cloudflare | Cloud DNS | `dns_domains.tf` |
| Stripe (webhooks) | Pub/Sub topics + subscriptions | `pubsub.tf` |
| GitHub | Cloud Source Repositories *(deprecated — see below)* | `source_repo.tf` |
| Resend | Pub/Sub email queue (+ Cloud Tasks API enabled) | `pubsub.tf` |
| Clerk | Identity Platform | `identity_platform.tf` |
| PostHog | BigQuery dataset (+ Cloud Logging) | `bigquery.tf` |
| Sentry | Error Reporting + Cloud Logging (API enablement only) | `apis.tf` |
| Upstash | Memorystore for Redis (+ VPC connector) | `redis.tf`, `network.tf` |
| Pinecone | Vertex AI Vector Search (index + endpoint) | `vertex_ai.tf` |

## Prerequisites

- Terraform >= 1.5
- `gcloud` CLI authenticated: `gcloud auth application-default login`
- A GCP project with **billing enabled**
- Permissions: `roles/owner` on the project (or the granular equivalents)

## Usage

```bash
cd infra/gcp
cp terraform.tfvars.example terraform.tfvars   # then edit values

terraform init
terraform plan
terraform apply
```

First apply takes ~15–25 min (API enablement, Redis instance, VPC connector,
and the Vertex AI index are slow to create).

### Remote state (recommended)

```bash
gsutil mb -l europe-west2 gs://<project-id>-tfstate
gsutil versioning set on gs://<project-id>-tfstate
```

Then uncomment the `backend "gcs"` block in `versions.tf` and run
`terraform init -migrate-state`.

## Deploying the app image

The service starts with a public placeholder image so the first apply succeeds.
Push your real image to Artifact Registry and deploy:

```bash
REPO=$(terraform output -raw artifact_registry_repo)
gcloud auth configure-docker europe-west2-docker.pkg.dev

docker build -t "$REPO/app:latest" .
docker push "$REPO/app:latest"

gcloud run deploy app-frontend-service \
  --image "$REPO/app:latest" --region europe-west2
```

Terraform ignores image changes on the Cloud Run service
(`lifecycle.ignore_changes`), so CI/CD deploys won't fight with `terraform apply`.

## Important caveats & decisions

### 1. Cloud Domains registration is opt-in (`register_domain = false` by default)
Registering a domain **charges the yearly fee immediately** and requires the
exact registry price as confirmation. Get it with:

```bash
gcloud domains registrations get-register-parameters <domain>
```

If the domain already exists at Namecheap/elsewhere, leave `register_domain`
off and instead point the domain's nameservers at the Cloud DNS zone
(`terraform output dns_nameservers`). The Cloud Domains API also requires
registrant, admin **and** technical contacts — the original draft only had
registrant and would have failed; all three are wired to the same contact
variables here.

### 2. Cloud Run domain mapping is opt-in (`enable_domain_mapping = false`)
Domain mappings are only supported in a limited set of regions —
**europe-west2 (London) is not one of them**. Options:

- Deploy in a supported region (e.g. `europe-west1`) and set
  `enable_domain_mapping = true` — the required DNS records are then created
  automatically in the zone; or
- Keep europe-west2 and front Cloud Run with a **global external HTTPS load
  balancer + serverless NEG** (also gives you Cloud CDN and Cloud Armor).

### 3. Cloud Source Repositories is deprecated (`enable_source_repo = false`)
CSR has been closed to new customers since June 2024 — creating a repo on a
fresh project fails. Recommended: keep code on GitHub and connect it to
**Cloud Build** (2nd-gen GitHub connection) for CI/CD into Cloud Run.

### 4. Identity Platform is enable-once
`google_identity_platform_config` initialises Identity Platform and **cannot
be disabled afterwards**. If the project already uses Firebase Auth, import
instead: `terraform import google_identity_platform_config.auth_config <project-id>`.

### 5. Redis is private-IP only
Memorystore has no public endpoint. The config creates a VPC and a Serverless
VPC Access connector, and injects `REDIS_HOST` / `REDIS_PORT` env vars into
the Cloud Run service. Anything else that needs Redis must be on the same VPC.

### 6. Vertex AI Vector Search
The index (768 dims, dot-product, tree-AH, `STREAM_UPDATE`) matches Gemini
`text-embedding-004`. An index **endpoint** is also created; to serve queries
you must deploy the index to the endpoint (a `gcloud ai index-endpoints
deploy-index` step or a follow-up `google_vertex_ai_index_endpoint_deployed_index`
resource). Note: a deployed index runs on always-on nodes and is the most
expensive item in this stack — deploy it only when the feature is ready.

### 7. Ongoing cost (rough, idle stack)
| Item | ~Cost/month |
|---|---|
| Memorystore Redis 1 GB BASIC | ~$35 |
| Serverless VPC connector (2× e2-micro) | ~$15 |
| Cloud DNS zone | ~$0.20 |
| Cloud Run (scale-to-zero) | ~$0 idle |
| Vertex AI index (undeployed) | ~$0 |
| Vertex AI index (deployed) | $500+ |
| BigQuery / Pub/Sub | usage-based |

## Post-apply checklist

1. Push the real container image and `gcloud run deploy` (see above).
2. Point the domain's nameservers at `dns_nameservers` output (or set
   `register_domain = true`).
3. In the console, finish Identity Platform setup (OAuth providers, email
   templates) and copy the API key into the app config.
4. Point the Stripe webhook endpoint at a handler that publishes to
   `stripe-events-topic` (Cloud Run service or Cloud Function).
5. Grant the Cloud Run runtime SA (`cloud_run_service_account` output) the
   roles it needs: `roles/pubsub.publisher`, `roles/bigquery.dataEditor`,
   `roles/aiplatform.user`, `roles/errorreporting.writer`.
6. When the vector-search feature ships, deploy the index to the endpoint.
