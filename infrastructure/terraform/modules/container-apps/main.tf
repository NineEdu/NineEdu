# Container Apps Environment (managed Kubernetes environment)
resource "azurerm_container_app_environment" "env" {
  name                = "${var.environment}-env"
  resource_group_name = var.resource_group_name
  location            = var.location

  tags = var.tags
}

# Backend Container App
resource "azurerm_container_app" "backend" {
  name                         = "${var.environment}-backend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "5002"
      }

      env {
        name  = "ALLOWED_ORIGINS"
        value = "https://production-frontend.redmeadow-589599f0.southeastasia.azurecontainerapps.io"
      }

      # Secrets from variables
      dynamic "env" {
        for_each = var.backend_env_vars
        content {
          name        = env.key
          secret_name = env.value
        }
      }
    }

    min_replicas = var.min_replicas
    max_replicas = var.max_replicas
  }

  # Define secrets (values from variables)
  dynamic "secret" {
    for_each = nonsensitive(var.secrets)
    content {
      name  = secret.key
      value = secret.value
    }
  }

  ingress {
    external_enabled = true
    target_port      = 5002
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  registry {
    server               = var.registry_server
    username             = var.registry_username
    password_secret_name = "registry-password"
  }

  tags = var.tags
}

# Frontend Container App
resource "azurerm_container_app" "frontend" {
  name                         = "${var.environment}-frontend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"

  template {
    container {
      name   = "frontend"
      image  = var.frontend_image
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PORT"
        value = "3000"
      }

      # Backend URL from backend container app
      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = "https://${azurerm_container_app.backend.ingress[0].fqdn}/api"
      }

      # Additional frontend env vars
      dynamic "env" {
        for_each = var.frontend_env_vars
        content {
          name        = env.key
          secret_name = env.value
        }
      }
    }

    min_replicas = var.min_replicas
    max_replicas = var.frontend_max_replicas
  }

  dynamic "secret" {
    for_each = nonsensitive(var.secrets)
    content {
      name  = secret.key
      value = secret.value
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  registry {
    server               = var.registry_server
    username             = var.registry_username
    password_secret_name = "registry-password"
  }

  tags = var.tags
}
