# ==============================================================================
# OUTPUTS
# ==============================================================================

output "cloud_run_url" {
  value       = google_cloud_run_v2_service.web_app.uri
  description = "The direct URL of the deployed Cloud Run service"
}

output "cloud_run_service_account" {
  value       = google_service_account.web_app.email
  description = "Runtime service account of the Cloud Run service (grant it access to Pub/Sub, BigQuery, Vertex AI as needed)"
}

output "artifact_registry_repo" {
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app_images.repository_id}"
  description = "Push container images here (docker push <repo>/app:tag)"
}

output "dns_nameservers" {
  value       = google_dns_managed_zone.app_dns_zone.name_servers
  description = "Assign these nameservers at your registrar to point the domain at GCP Cloud DNS"
}

output "redis_host" {
  value       = google_redis_instance.cache.host
  description = "Private IP address for Redis cache connection (reachable from Cloud Run via the VPC connector)"
}

output "redis_port" {
  value       = google_redis_instance.cache.port
  description = "Redis port"
}

output "pubsub_topics" {
  value = {
    stripe_webhooks = google_pubsub_topic.stripe_webhooks.id
    email_queue     = google_pubsub_topic.email_queue.id
    dead_letter     = google_pubsub_topic.dead_letter.id
  }
  description = "Pub/Sub topic IDs for the Stripe and email pipelines"
}

output "vertex_index_id" {
  value       = google_vertex_ai_index.vector_search_index.id
  description = "Vertex AI Vector Search index ID"
}

output "vertex_index_endpoint_id" {
  value       = google_vertex_ai_index_endpoint.vector_search_endpoint.id
  description = "Vertex AI Vector Search index endpoint ID (deploy the index here to serve queries)"
}

output "bigquery_dataset" {
  value       = google_bigquery_dataset.analytics_dataset.dataset_id
  description = "BigQuery dataset for analytics events"
}
