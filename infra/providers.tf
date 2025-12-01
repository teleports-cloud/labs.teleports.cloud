terraform {
  required_version = ">= 1.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
  # API token will be read from VERCEL_API_TOKEN environment variable
  # or can be set via api_token attribute
  team = var.vercel_team_id
}
