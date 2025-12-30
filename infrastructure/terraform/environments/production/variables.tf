# Image tag variable
variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

# Secrets variables
variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Google GenAI API key"
  type        = string
  sensitive   = true
}

variable "groq_api_key" {
  description = "Groq API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudinary_cloud_name" {
  description = "Cloudinary cloud name"
  type        = string
}

variable "cloudinary_api_key" {
  description = "Cloudinary API key"
  type        = string
  sensitive   = true
}

variable "cloudinary_api_secret" {
  description = "Cloudinary API secret"
  type        = string
  sensitive   = true
}

variable "firebase_service_account" {
  description = "Firebase service account JSON as string"
  type        = string
  sensitive   = true
}

variable "pinata_jwt" {
  description = "Pinata JWT token"
  type        = string
  sensitive   = true
}

variable "next_public_gateway_url" {
  description = "Pinata Gateway URL"
  type        = string
}

# VNPay payment gateway variables
variable "vnp_tmn_code" {
  description = "VNPay Terminal/Merchant Code"
  type        = string
  sensitive   = true
}

variable "vnp_hash_secret" {
  description = "VNPay Hash Secret Key"
  type        = string
  sensitive   = true
}

variable "vnp_url" {
  description = "VNPay Payment Gateway URL"
  type        = string
  default     = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
}
