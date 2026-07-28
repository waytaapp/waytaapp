# ==============================================================================
# 9. POSTHOG -> BIGQUERY (Raw Event Analytics Data Warehouse)
# ==============================================================================

resource "google_bigquery_dataset" "analytics_dataset" {
  dataset_id                  = "app_analytics"
  friendly_name               = "App Event Analytics"
  description                 = "Stores all clickstream, usage, and user activity events."
  location                    = var.bigquery_location
  default_table_expiration_ms = var.analytics_table_expiration_ms

  depends_on = [google_project_service.required_services]
}
