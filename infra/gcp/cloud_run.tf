# ==============================================================================
# 2. VERCEL -> CLOUD RUN (Web App Deployment)
# ==============================================================================

# Artifact Registry repository for the app's container images.
# (Container Registry / gcr.io is deprecated — push images here instead.)
resource "google_artifact_registry_repository" "app_images" {
  repository_id = "${var.app_name}-images"
  location      = var.region
  format        = "DOCKER"
  description   = "Container images for the web application"

  depends_on = [google_project_service.required_services]
}

locals {
  # Deploy a public "hello" placeholder until the first real image is pushed,
  # so `terraform apply` succeeds on a fresh project.
  container_image = var.container_image != "" ? var.container_image : "us-docker.pkg.dev/cloudrun/container/hello"
}

# Dedicated runtime service account (least privilege — no default compute SA).
resource "google_service_account" "web_app" {
  account_id   = "${var.app_name}-frontend-sa"
  display_name = "Cloud Run web app runtime service account"
}

resource "google_cloud_run_v2_service" "web_app" {
  name     = "${var.app_name}-frontend-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.web_app.email

    scaling {
      min_instance_count = 0
      max_instance_count = var.cloud_run_max_instances
    }

    # Private egress path to Memorystore Redis.
    vpc_access {
      connector = google_vpc_access_connector.serverless.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = local.container_image

      resources {
        limits = {
          cpu    = var.cloud_run_cpu
          memory = var.cloud_run_memory
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "REDIS_HOST"
        value = google_redis_instance.cache.host
      }

      env {
        name  = "REDIS_PORT"
        value = tostring(google_redis_instance.cache.port)
      }
    }
  }

  lifecycle {
    # The image is updated by CI/CD (gcloud run deploy), not Terraform.
    ignore_changes = [template[0].containers[0].image]
  }

  depends_on = [google_project_service.required_services]
}

# Allow unauthenticated public access (Vercel-style public web app).
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = google_cloud_run_v2_service.web_app.project
  location = google_cloud_run_v2_service.web_app.location
  name     = google_cloud_run_v2_service.web_app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
