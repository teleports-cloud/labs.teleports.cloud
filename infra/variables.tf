variable "vercel_team_id" {
  description = "Vercel team ID (orgId from .vercel/project.json)"
  type        = string
  default     = "team_ukOUCjpIguZVPwMTYcvObu4n"
}

variable "vercel_project_id" {
  description = "Existing Vercel project ID"
  type        = string
  default     = "prj_EL6lrTT6jbwB92nw35dAjkCD8TrJ"
}

variable "github_repo" {
  description = "GitHub repository in format: owner/repo"
  type        = string
  default     = "teleports-cloud/labs.teleports.cloud"
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
