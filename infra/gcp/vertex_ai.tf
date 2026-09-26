# ==============================================================================
# 7. PINECONE -> VERTEX AI VECTOR SEARCH
# ==============================================================================

# Staging bucket for index contents — required by the index API even for
# STREAM_UPDATE indexes (used for the initial/batch embedding loads).
resource "google_storage_bucket" "embeddings" {
  name                        = "${var.project_id}-${var.app_name}-embeddings"
  location                    = var.region
  uniform_bucket_level_access = true

  depends_on = [google_project_service.required_services]
}

resource "google_vertex_ai_index" "vector_search_index" {
  display_name = "${var.app_name}-embeddings-index"
  region       = var.region
  description  = "Vector index for app embeddings (Gemini / AI Studio embedding models)"

  metadata {
    contents_delta_uri = "gs://${google_storage_bucket.embeddings.name}/index-contents"

    config {
      dimensions                  = var.embedding_dimensions
      approximate_neighbors_count = 150
      distance_measure_type       = "DOT_PRODUCT_DISTANCE"

      algorithm_config {
        tree_ah_config {
          leaf_node_embedding_count    = 500
          leaf_nodes_to_search_percent = 10
        }
      }
    }
  }

  index_update_method = "STREAM_UPDATE"

  depends_on = [google_project_service.required_services]
}

# To serve queries, the index must be deployed to an endpoint.
resource "google_vertex_ai_index_endpoint" "vector_search_endpoint" {
  display_name            = "${var.app_name}-embeddings-endpoint"
  region                  = var.region
  public_endpoint_enabled = true

  depends_on = [google_project_service.required_services]
}
