# Vercel Project (imported from existing)
resource "vercel_project" "web" {
  name      = "web"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  build_command    = "cd apps/web && pnpm build"
  install_command  = "pnpm install"
  output_directory = "apps/web/.next"
  root_directory   = "apps/web"
}

# Domain for labs.teleports.cloud
resource "vercel_domain" "labs" {
  domain = "labs.teleports.cloud"
  team_id = var.vercel_team_id
}

# DNS record for api.labs.teleports.cloud -> Render
resource "vercel_dns_record" "api" {
  domain = vercel_domain.labs.domain
  type   = "CNAME"
  name   = "api"
  value  = "labs-teleports-cloud.onrender.com."
  ttl    = 60
}

# Project domain configuration
resource "vercel_project_domain" "labs_production" {
  project_id = vercel_project.web.id
  domain     = vercel_domain.labs.domain
}
