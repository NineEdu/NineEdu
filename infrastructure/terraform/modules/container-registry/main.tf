resource "azurerm_container_registry" "acr" {
  name                = var.registry_name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic" # Start with Basic, upgrade to Standard/Premium as needed
  admin_enabled       = true    # Enable for simplicity, use managed identity in production

  tags = var.tags
}
