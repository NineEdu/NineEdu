terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "nineedu-rg"
    storage_account_name = "nineudutfstate"
    container_name       = "tfstate"
    key                  = "staging.terraform.tfstate"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

locals {
  environment = "staging"
  location    = "eastus"

  tags = {
    Environment = "staging"
    Project     = "NineEdu"
    ManagedBy   = "Terraform"
  }
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "nineedu-staging-rg"
  location = local.location
  tags     = local.tags
}

# Container Registry Module
module "container_registry" {
  source = "../../modules/container-registry"

  registry_name       = "nineedustagingacr"
  resource_group_name = azurerm_resource_group.main.name
  location            = local.location
  tags                = local.tags
}

# Key Vault Module
module "key_vault" {
  source = "../../modules/key-vault"

  key_vault_name      = "nineedu-stg-kv"
  resource_group_name = azurerm_resource_group.main.name
  location            = local.location
  environment         = local.environment
  tags                = local.tags
}

# Container Apps Module
module "container_apps" {
  source = "../../modules/container-apps"

  environment         = local.environment
  resource_group_name = azurerm_resource_group.main.name
  location            = local.location

  backend_image  = "${module.container_registry.login_server}/backend:${var.image_tag}"
  frontend_image = "${module.container_registry.login_server}/frontend:${var.image_tag}"

  registry_server   = module.container_registry.login_server
  registry_username = module.container_registry.admin_username

  # All secrets including registry password
  secrets = merge(
    {
      "registry-password"          = module.container_registry.admin_password
      "mongo-uri"                  = var.mongo_uri
      "jwt-secret"                 = var.jwt_secret
      "gemini-api-key"             = var.gemini_api_key
      "groq-api-key"               = var.groq_api_key
      "cloudinary-cloud-name"      = var.cloudinary_cloud_name
      "cloudinary-api-key"         = var.cloudinary_api_key
      "cloudinary-api-secret"      = var.cloudinary_api_secret
      "firebase-service-account"   = var.firebase_service_account
      "pinata-jwt"                 = var.pinata_jwt
      "next-public-gateway-url"    = var.next_public_gateway_url
    }
  )

  # Backend environment variables mapped to secrets
  backend_env_vars = {
    MONGO_URI                  = "mongo-uri"
    JWT_SECRET                 = "jwt-secret"
    GEMINI_API_KEY             = "gemini-api-key"
    GROQ_API_KEY               = "groq-api-key"
    CLOUDINARY_CLOUD_NAME      = "cloudinary-cloud-name"
    CLOUDINARY_API_KEY         = "cloudinary-api-key"
    CLOUDINARY_API_SECRET      = "cloudinary-api-secret"
    FIREBASE_SERVICE_ACCOUNT   = "firebase-service-account"
  }

  # Frontend environment variables mapped to secrets
  frontend_env_vars = {
    NEXT_PUBLIC_GATEWAY_URL = "next-public-gateway-url"
    PINATA_JWT              = "pinata-jwt"
  }

  min_replicas           = 1
  max_replicas           = 3
  frontend_max_replicas  = 5

  tags = local.tags
}

# Outputs
output "frontend_url" {
  value       = module.container_apps.frontend_url
  description = "Frontend application URL"
}

output "backend_url" {
  value       = module.container_apps.backend_url
  description = "Backend API URL"
}

output "container_registry_login_server" {
  value       = module.container_registry.login_server
  description = "Container Registry login server"
}
