terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Recommended: keep state in a GCS bucket instead of on disk.
  # Create the bucket once (see README), then uncomment and run `terraform init -migrate-state`.
  #
  # backend "gcs" {
  #   bucket = "<your-project-id>-tfstate"
  #   prefix = "gcp-saas/infra"
  # }
}
