# ==============================================================================
# Core
# ==============================================================================

variable "project_id" {
  type        = string
  description = "Google Cloud Project ID"
}

variable "region" {
  type        = string
  default     = "europe-west2"
  description = "Primary GCP region for regional resources (Cloud Run, Redis, Vertex AI, VPC connector)."
}

variable "domain_name" {
  type        = string
  description = "Your web app domain name (e.g., app.example.com)"
}

variable "app_name" {
  type        = string
  default     = "app"
  description = "Short name used as a prefix for resource names."
}

# ==============================================================================
# Cloud Run
# ==============================================================================

variable "container_image" {
  type        = string
  default     = ""
  description = <<-EOT
    Full container image path for the web app, e.g.
    "<region>-docker.pkg.dev/<project>/<repo>/app:latest".
    Leave empty to deploy a public placeholder image on first apply
    (so the service can be created before your first image is pushed).
  EOT
}

variable "cloud_run_cpu" {
  type        = string
  default     = "1000m"
  description = "CPU limit per Cloud Run instance."
}

variable "cloud_run_memory" {
  type        = string
  default     = "512Mi"
  description = "Memory limit per Cloud Run instance."
}

variable "cloud_run_max_instances" {
  type        = number
  default     = 10
  description = "Maximum number of Cloud Run instances (cost guardrail)."
}

variable "enable_domain_mapping" {
  type        = bool
  default     = false
  description = <<-EOT
    Map the domain directly to Cloud Run with a domain mapping.
    NOTE: Cloud Run domain mappings are only supported in a limited set of
    regions (europe-west1/west4, us-central1, ... — NOT europe-west2).
    For unsupported regions, front Cloud Run with a global external HTTPS
    load balancer instead (see README).
  EOT
}

# ==============================================================================
# Cloud Domains (domain registration)
# ==============================================================================

variable "register_domain" {
  type        = bool
  default     = false
  description = <<-EOT
    Set to true to REGISTER the domain through Cloud Domains (this charges
    the yearly registration fee to the project's billing account).
    Leave false if the domain is already registered elsewhere (e.g. Namecheap)
    — in that case just point its nameservers at the Cloud DNS zone.
  EOT
}

variable "registrant_email" {
  type        = string
  default     = ""
  description = "WHOIS registrant email. Required when register_domain = true."
}

variable "registrant_phone" {
  type        = string
  default     = ""
  description = "WHOIS registrant phone in E.164-ish Cloud Domains format, e.g. \"+27.123456789\". Required when register_domain = true."
}

variable "registrant_postal_address" {
  type = object({
    region_code   = string
    postal_code   = string
    locality      = string
    address_lines = list(string)
    recipients    = list(string)
  })
  default = {
    region_code   = "ZA"
    postal_code   = "0001"
    locality      = "Pretoria"
    address_lines = ["CBD"]
    recipients    = ["Admin"]
  }
  description = "WHOIS registrant postal address. Used when register_domain = true."
}

variable "domain_yearly_price" {
  type = object({
    currency_code = string
    units         = number
  })
  default = {
    currency_code = "USD"
    units         = 12
  }
  description = <<-EOT
    Yearly price of the domain, required by the Cloud Domains API as a
    confirmation. Must exactly match the registry price — run
    `gcloud domains registrations get-register-parameters <domain>` to get it.
  EOT
}

# ==============================================================================
# Source repository (deprecated service — see README)
# ==============================================================================

variable "enable_source_repo" {
  type        = bool
  default     = false
  description = <<-EOT
    Create a Cloud Source Repository. Cloud Source Repositories has been
    closed to new customers since June 2024 — this will fail on projects
    without prior CSR usage. Recommended: keep code on GitHub and connect
    it to Cloud Build instead.
  EOT
}

# ==============================================================================
# Redis
# ==============================================================================

variable "redis_memory_size_gb" {
  type        = number
  default     = 1
  description = "Memorystore Redis instance size in GB."
}

variable "redis_tier" {
  type        = string
  default     = "BASIC"
  description = "Memorystore tier: BASIC (no replica) or STANDARD_HA."
  validation {
    condition     = contains(["BASIC", "STANDARD_HA"], var.redis_tier)
    error_message = "redis_tier must be BASIC or STANDARD_HA."
  }
}

# ==============================================================================
# Vertex AI Vector Search
# ==============================================================================

variable "embedding_dimensions" {
  type        = number
  default     = 768
  description = "Embedding vector dimensions. 768 matches Gemini text-embedding-004 / AI Studio embedding models."
}

# ==============================================================================
# BigQuery
# ==============================================================================

variable "bigquery_location" {
  type        = string
  default     = "EU"
  description = "BigQuery dataset location (multi-region EU keeps analytics data in Europe alongside europe-west2)."
}

variable "analytics_table_expiration_ms" {
  type        = number
  default     = null
  description = "Default table expiration in ms for the analytics dataset. null = tables never expire. (e.g. 3600000000 ≈ 41.7 days)"
}
