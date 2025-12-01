# Infrastructure Configuration

This directory contains OpenTofu/Terraform configuration for managing the labs.teleports.cloud infrastructure.

## Prerequisites

- OpenTofu or Terraform installed
- Vercel API token
- Render API key

## Setup

### 1. Get Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Create a new token with appropriate scope
3. Export as environment variable:

```bash
export VERCEL_API_TOKEN="your_token_here"
```

### 2. Get Render API Key

1. Go to https://dashboard.render.com/u/settings#api-keys
2. Create a new API key
3. Copy to terraform.tfvars (see step 3)

### 3. Create terraform.tfvars

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars and add your Render API key
```

### 4. Initialize OpenTofu

```bash
cd infra
tofu init
```

### 5. Import Existing Resources (First Time Only)

Since the infrastructure already exists, import the existing resources:

```bash
# Import Vercel project
tofu import vercel_project.web prj_EL6lrTT6jbwB92nw35dAjkCD8TrJ

# Import Vercel domain
tofu import vercel_domain.labs labs.teleports.cloud

# Import DNS record (if it exists)
tofu import vercel_dns_record.api rec_a5fee5b4b46a89db0c7bb454
```

### 6. Plan and Apply

```bash
# Review changes
tofu plan

# Apply changes
tofu apply
```

## Managing Infrastructure

### Deploy Changes

After importing, you can manage infrastructure changes:

```bash
cd infra
tofu plan   # Preview changes
tofu apply  # Apply changes
```

### Update DNS Records

The DNS record for `api.labs.teleports.cloud` is managed in `vercel.tf`. Modify the configuration and run `tofu apply`.

### View Current State

```bash
tofu show
tofu state list
```

## Resources Managed

- **Vercel Project**: Next.js web application
- **Vercel Domain**: labs.teleports.cloud
- **Vercel DNS**: api.labs.teleports.cloud CNAME to Render
- **Vercel Project Domain**: Domain attachment to project

## Notes

- The Vercel provider uses the team ID to scope operations to the correct account
- Sensitive values like API keys should never be committed to git
- The Render resources would need a Render Terraform provider (currently manual)
