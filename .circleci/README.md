# CircleCI Configuration

This directory contains the CircleCI pipeline configuration for automated builds and deployments.

## Quick Start

### Setup
```bash
# From project root
./setup-circleci.sh
```

### Validate Config
```bash
circleci config validate
```

### Process Config (See Final YAML)
```bash
circleci config process .circleci/config.yml
```

### Local Testing
```bash
# Requires Docker
circleci local execute --job validate_config
circleci local execute --job build_frontend
circleci local execute --job build_backend
```

## Pipeline Jobs

### 1. `validate_config`
- Validates CircleCI configuration
- Runs first to catch config errors
- Installs and uses CircleCI CLI

### 2. `build_frontend`
- Node.js 20.11 environment
- Installs dependencies with pnpm
- Runs lint and type-check
- Builds Next.js app
- Caches dependencies

### 3. `deploy_frontend`
- Deploys to Vercel
- Only runs on `main` branch
- Requires `deployment-secrets` context

### 4. `build_backend`
- Python 3.11 environment
- Installs dependencies in venv
- Validates Python syntax
- Caches dependencies

### 5. `deploy_backend`
- Triggers Render deployment
- Only runs on `main` branch
- Requires `deployment-secrets` context

## Required Environment Variables

Set these in CircleCI context `deployment-secrets`:

- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_PROJECT_ID` - (Optional) Vercel project ID
- `VERCEL_TEAM_ID` - (Optional) Vercel team ID
- `RENDER_API_KEY` - Render API key
- `RENDER_DEPLOY_HOOK_ID` - Render deploy hook ID

## Workflow

```
validate_config
      │
      ├─→ build_frontend ─→ deploy_frontend (main only)
      │
      └─→ build_backend ─→ deploy_backend (main only)
```

## Caching Strategy

- **Frontend**: Caches pnpm store keyed by `package.json` checksum
- **Backend**: Caches Python venv keyed by `requirements.txt` checksum

## Branch Rules

- **All branches**: Build and test
- **`main` branch**: Build, test, and deploy

## Configuration Updates

After modifying `config.yml`:

1. Validate locally:
   ```bash
   circleci config validate
   ```

2. Commit and push:
   ```bash
   git add .circleci/config.yml
   git commit -m "Update CircleCI config"
   git push
   ```

3. Monitor at:
   https://app.circleci.com/pipelines/github/YOUR_ORG/labs.teleports.cloud

## Documentation

See `CIRCLECI_SETUP.md` in project root for complete setup guide.

## Troubleshooting

### Config validation fails
```bash
circleci config validate
```

### View processed config
```bash
circleci config process .circleci/config.yml
```

### Check CLI version
```bash
circleci version
```

### Update CLI
```bash
circleci update
```

## Orbs Used

- `circleci/node@5.2.0` - Node.js build environment
- `circleci/python@2.1.1` - Python build environment

## Resources

- [CircleCI Docs](https://circleci.com/docs/)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
