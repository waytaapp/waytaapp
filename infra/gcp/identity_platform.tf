# ==============================================================================
# 5. CLERK -> IDENTITY PLATFORM (AUTH)
# ==============================================================================
# NOTE: Identity Platform can only be initialised ONCE per project and cannot
# be disabled afterwards. If it was already enabled (e.g. via Firebase Auth),
# import this resource instead of creating it:
#   terraform import google_identity_platform_config.auth_config <project-id>

resource "google_identity_platform_config" "auth_config" {
  provider = google-beta

  sign_in {
    allow_duplicate_emails = false

    email {
      enabled           = true
      password_required = true
    }
  }

  authorized_domains = [
    "localhost",
    var.domain_name,
  ]

  depends_on = [google_project_service.required_services]
}
