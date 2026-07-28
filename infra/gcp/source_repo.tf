# ==============================================================================
# 4. GITHUB -> CLOUD SOURCE REPOSITORIES  (OPT-IN — service is deprecated)
# ==============================================================================
# Cloud Source Repositories has been closed to new customers since
# June 12, 2024. Creating this on a project without prior CSR usage will fail.
# Recommended alternative: keep the code on GitHub and connect the repo to
# Cloud Build (2nd gen GitHub connection) for CI/CD — see README.

resource "google_sourcerepo_repository" "app_repo" {
  count = var.enable_source_repo ? 1 : 0

  name = "${var.app_name}-repository"

  depends_on = [google_project_service.required_services]
}
