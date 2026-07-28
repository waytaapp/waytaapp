# ==============================================================================
# 6. UPSTASH -> MEMORYSTORE FOR REDIS
# ==============================================================================

resource "google_redis_instance" "cache" {
  name               = "${var.app_name}-redis-cache"
  tier               = var.redis_tier
  memory_size_gb     = var.redis_memory_size_gb
  location_id        = "${var.region}-a"
  authorized_network = google_compute_network.app_vpc.id

  redis_version = "REDIS_7_0"
  display_name  = "Application Redis Cache"

  depends_on = [google_project_service.required_services]
}
