variable "registry_name" {
  description = "Name of the Azure Container Registry"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for the registry"
  type        = string
}

variable "tags" {
  description = "Tags to apply to the registry"
  type        = map(string)
  default     = {}
}
