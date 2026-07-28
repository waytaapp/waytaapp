# ==============================================================================
# 1. ENABLE REQUIRED API SERVICES
# ==============================================================================

locals {
  required_services = [
    "run.googleapis.com",                 # Vercel        -> Cloud Run
    "artifactregistry.googleapis.com",    # Docker Hub    -> Artifact Registry (gcr.io is deprecated)
    "domains.googleapis.com",             # Namecheap     -> Cloud Domains
    "dns.googleapis.com",                 # Cloudflare    -> Cloud DNS
    "identitytoolkit.googleapis.com",     # Clerk         -> Identity Platform
    "clouderrorreporting.googleapis.com", # Sentry        -> Error Reporting
    "logging.googleapis.com",             # Sentry/PostHog-> Cloud Logging
    "bigquery.googleapis.com",            # PostHog       -> BigQuery Analytics
    "redis.googleapis.com",               # Upstash       -> Memorystore for Redis
    "aiplatform.googleapis.com",          # Pinecone      -> Vertex AI Vector Search
    "pubsub.googleapis.com",              # Stripe/Resend -> Pub/Sub queues
    "cloudtasks.googleapis.com",          # Resend        -> Cloud Tasks (email dispatch orchestration)
    "vpcaccess.googleapis.com",           # Serverless VPC Access (Cloud Run -> Redis)
    "compute.googleapis.com",             # VPC network for Redis
    "storage.googleapis.com",             # GCS bucket for Vertex AI index contents
  ]

  # sourcerepo.googleapis.com is closed to new customers (June 2024); only
  # enabled when explicitly requested via enable_source_repo.
  services = var.enable_source_repo ? concat(local.required_services, ["sourcerepo.googleapis.com"]) : local.required_services
}

resource "google_project_service" "required_services" {
  for_each = toset(local.services)

  service            = each.key
  disable_on_destroy = false
}
