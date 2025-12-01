variable "vercel_team_id" {
  description = "Vercel team ID (orgId from .vercel/project.json)"
  type        = string
}

variable "vercel_project_id" {
  description = "Existing Vercel project ID"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name (e.g., username/repo) - Now pointing to the mirrored repo"
  type        = string
  default     = "teleports-cloud/labs.teleports.cloud"
}

variable "vercel_root_domain" {
  description = "The root domain for the Vercel project (e.g., labs.teleports.cloud)"
  type        = string
  default     = "labs.teleports.cloud"
}

variable "render_service_id" {
  description = "Render service ID"
  type        = string
  default     = "srv-d4mk1kruibrs738liamg"
}

variable "render_api_key" {
  description = "Render API key"
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token (https://dash.cloudflare.com/profile/api-tokens)"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for teleports.cloud"
  type        = string
}