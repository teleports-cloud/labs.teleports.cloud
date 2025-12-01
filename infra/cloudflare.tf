# Cloudflare DNS record for api.labs.teleports.cloud -> Render
resource "cloudflare_record" "api_subdomain" {
  zone_id = var.cloudflare_zone_id
  name    = "api.labs" // Cloudflare manages labs.teleports.cloud directly
  content = "labs-teleports-cloud.onrender.com"
  type    = "CNAME"
  proxied = false
  ttl     = 1
}

# Cloudflare DNS record for labs.teleports.cloud -> Vercel
resource "cloudflare_record" "root_domain" {
  zone_id = var.cloudflare_zone_id
  name    = "labs"
  content   = "cname.vercel-dns.com."
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www_subdomain" {
  zone_id = var.cloudflare_zone_id
  name    = "www.labs"
  content   = "labs.teleports.cloud"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
