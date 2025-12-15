output "environment_id" {
  description = "The ID of the Container Apps Environment"
  value       = azurerm_container_app_environment.env.id
}

output "backend_id" {
  description = "The ID of the backend Container App"
  value       = azurerm_container_app.backend.id
}

output "frontend_id" {
  description = "The ID of the frontend Container App"
  value       = azurerm_container_app.frontend.id
}

output "backend_url" {
  description = "The URL of the backend application"
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

output "frontend_url" {
  description = "The URL of the frontend application"
  value       = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

output "backend_fqdn" {
  description = "The FQDN of the backend Container App"
  value       = azurerm_container_app.backend.ingress[0].fqdn
}

output "frontend_fqdn" {
  description = "The FQDN of the frontend Container App"
  value       = azurerm_container_app.frontend.ingress[0].fqdn
}
