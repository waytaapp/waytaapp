# ==============================================================================
# 8. STRIPE & RESEND -> PUB/SUB PIPELINES (Async Messaging / Webhooks)
# ==============================================================================

resource "google_pubsub_topic" "stripe_webhooks" {
  name = "stripe-events-topic"

  depends_on = [google_project_service.required_services]
}

resource "google_pubsub_topic" "email_queue" {
  name = "email-dispatch-topic"

  depends_on = [google_project_service.required_services]
}

# Dead-letter topic shared by both pipelines so poison messages are retained
# for inspection instead of being retried forever.
resource "google_pubsub_topic" "dead_letter" {
  name = "dead-letter-topic"

  depends_on = [google_project_service.required_services]
}

# Pull subscriptions for backend workers (swap to push subscriptions targeting
# a Cloud Run URL once webhook/email handler services exist).
resource "google_pubsub_subscription" "stripe_worker" {
  name  = "stripe-events-worker"
  topic = google_pubsub_topic.stripe_webhooks.id

  ack_deadline_seconds = 30

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}

resource "google_pubsub_subscription" "email_worker" {
  name  = "email-dispatch-worker"
  topic = google_pubsub_topic.email_queue.id

  ack_deadline_seconds = 30

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}
