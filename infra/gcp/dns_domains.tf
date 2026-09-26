# ==============================================================================
# 3. NAMECHEAP & CLOUDFLARE -> CLOUD DOMAINS & CLOUD DNS
# ==============================================================================

resource "google_dns_managed_zone" "app_dns_zone" {
  name        = "${var.app_name}-dns-zone"
  dns_name    = "${var.domain_name}."
  description = "Managed DNS Zone for Web Application"

  dnssec_config {
    state = "on"
  }

  depends_on = [google_project_service.required_services]
}

# ------------------------------------------------------------------------------
# Domain registration via Cloud Domains — OPT-IN (register_domain = true).
# Skip this if the domain already exists at another registrar; just point its
# nameservers at the Cloud DNS zone (see dns_nameservers output).
# The API requires registrant, admin AND technical contacts, plus the exact
# yearly price as confirmation.
# ------------------------------------------------------------------------------

locals {
  domain_contact = {
    email        = var.registrant_email
    phone_number = var.registrant_phone
  }
}

resource "google_clouddomains_registration" "main_domain" {
  count = var.register_domain ? 1 : 0

  domain_name = var.domain_name
  location    = "global"

  dns_settings {
    custom_dns {
      name_servers = google_dns_managed_zone.app_dns_zone.name_servers
    }
  }

  yearly_price {
    currency_code = var.domain_yearly_price.currency_code
    units         = var.domain_yearly_price.units
  }

  contact_settings {
    privacy = "REDACTED_CONTACT_DATA"

    registrant_contact {
      email        = local.domain_contact.email
      phone_number = local.domain_contact.phone_number
      postal_address {
        region_code   = var.registrant_postal_address.region_code
        postal_code   = var.registrant_postal_address.postal_code
        locality      = var.registrant_postal_address.locality
        address_lines = var.registrant_postal_address.address_lines
        recipients    = var.registrant_postal_address.recipients
      }
    }

    admin_contact {
      email        = local.domain_contact.email
      phone_number = local.domain_contact.phone_number
      postal_address {
        region_code   = var.registrant_postal_address.region_code
        postal_code   = var.registrant_postal_address.postal_code
        locality      = var.registrant_postal_address.locality
        address_lines = var.registrant_postal_address.address_lines
        recipients    = var.registrant_postal_address.recipients
      }
    }

    technical_contact {
      email        = local.domain_contact.email
      phone_number = local.domain_contact.phone_number
      postal_address {
        region_code   = var.registrant_postal_address.region_code
        postal_code   = var.registrant_postal_address.postal_code
        locality      = var.registrant_postal_address.locality
        address_lines = var.registrant_postal_address.address_lines
        recipients    = var.registrant_postal_address.recipients
      }
    }
  }

  lifecycle {
    precondition {
      condition     = !var.register_domain || (var.registrant_email != "" && var.registrant_phone != "")
      error_message = "registrant_email and registrant_phone must be set when register_domain = true."
    }
  }

  depends_on = [google_dns_managed_zone.app_dns_zone]
}

# ------------------------------------------------------------------------------
# Cloud Run domain mapping — OPT-IN (enable_domain_mapping = true).
# Only works in regions that support domain mappings (europe-west2 is NOT one
# of them). For unsupported regions, use a global external HTTPS load balancer
# with a serverless NEG — see README.
# ------------------------------------------------------------------------------

resource "google_cloud_run_domain_mapping" "app_domain_map" {
  count = var.enable_domain_mapping ? 1 : 0

  location = var.region
  name     = var.domain_name

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.web_app.name
  }
}

# DNS records the domain mapping needs, created automatically when enabled.
resource "google_dns_record_set" "domain_mapping_records" {
  for_each = var.enable_domain_mapping ? {
    for rr in distinct([
      for record in google_cloud_run_domain_mapping.app_domain_map[0].status[0].resource_records : record.type
      ]) : rr => [
      for record in google_cloud_run_domain_mapping.app_domain_map[0].status[0].resource_records :
      record.rrdata if record.type == rr
    ]
  } : {}

  managed_zone = google_dns_managed_zone.app_dns_zone.name
  name         = "${var.domain_name}."
  type         = each.key
  ttl          = 300
  rrdatas      = each.value
}
