# ==============================================================================
# 6a. PRIVATE NETWORKING (VPC + Serverless VPC Access connector)
# ==============================================================================
# Memorystore Redis only has a private IP, so Cloud Run needs a Serverless
# VPC Access connector on the same network to reach it.

resource "google_compute_network" "app_vpc" {
  name                    = "${var.app_name}-vpc-network"
  auto_create_subnetworks = true

  depends_on = [google_project_service.required_services]
}

resource "google_vpc_access_connector" "serverless" {
  name    = "${var.app_name}-run-connector"
  region  = var.region
  network = google_compute_network.app_vpc.name

  # Dedicated /28 range for the connector — must not overlap existing subnets.
  ip_cidr_range = "10.8.0.0/28"

  min_instances = 2
  max_instances = 3

  depends_on = [google_project_service.required_services]
}
