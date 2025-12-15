variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "backend_image" {
  description = "Docker image for backend (with tag)"
  type        = string
}

variable "frontend_image" {
  description = "Docker image for frontend (with tag)"
  type        = string
}

variable "registry_server" {
  description = "Container registry login server"
  type        = string
}

variable "registry_username" {
  description = "Container registry username"
  type        = string
  sensitive   = true
}

variable "secrets" {
  description = "Map of secret names to values for container apps"
  type        = map(string)
  sensitive   = true
}

variable "backend_env_vars" {
  description = "Map of environment variable names to secret names for backend"
  type        = map(string)
  default     = {}
}

variable "frontend_env_vars" {
  description = "Map of environment variable names to secret names for frontend"
  type        = map(string)
  default     = {}
}

variable "min_replicas" {
  description = "Minimum number of replicas"
  type        = number
  default     = 1
}

variable "max_replicas" {
  description = "Maximum number of backend replicas"
  type        = number
  default     = 3
}

variable "frontend_max_replicas" {
  description = "Maximum number of frontend replicas"
  type        = number
  default     = 5
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
