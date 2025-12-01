# CircleCI Setup Guide

This project has been refactored to use CircleCI for continuous integration and deployment.

## Overview

The CircleCI pipeline handles:
- **Frontend (Next.js)**: Build, lint, type-check, and deploy to Vercel
- **Backend (Python)**: Install dependencies, syntax check, and deploy to Render
- **Validation**: Automatic configuration validation on every run

## Pipeline Architecture

```
┌─────────────────┐
│ validate_config │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────────┐ ┌──────────────┐
│  build_   │ │  build_      │
│  frontend │ │  backend     │
└─────┬─────┘ └──────┬───────┘
      │              │
      ▼              ▼
┌───────────┐ ┌──────────────┐
│  deploy_  │ │  deploy_     │
│  frontend │ │  backend     │
│ (Vercel)  │ │  (Render)    │
└───────────┘ └──────────────┘
```

## Initial Setup

### 1. Install CircleCI CLI

The CLI will be automatically installed when you run the setup script, or install manually:

```bash
curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/main/install.sh | bash
```

### 2. Authenticate with CircleCI

```bash
circleci setup
```

When prompted, enter your API key: `YOUR_CIRCLECI_API_KEY`

### 3. Validate Configuration

```bash
circleci config validate
```

### 4. Run Setup Script

```bash
./setup-circleci.sh
```

## Environment Variables Setup

### Create a CircleCI Context

1. Go to your project settings in CircleCI
2. Navigate to **Contexts** section
3. Create a new context named `deployment-secrets`

### Add Environment Variables

Add the following variables to the `deployment-secrets` context:

#### Vercel Deployment
- **VERCEL_TOKEN**: Your Vercel authentication token
- **VERCEL_PROJECT_ID**: (Optional) Specific project ID
- **VERCEL_TEAM_ID**: (Optional) Team ID if using Vercel Teams

#### Render Deployment
- **RENDER_API_KEY**: Your Render API key
- **RENDER_DEPLOY_HOOK_ID**: Deploy hook ID from Render dashboard

### How to Get These Values

#### Vercel Token
```bash
npx vercel login
npx vercel whoami
```
Or create at: https://vercel.com/account/tokens

#### Vercel Project ID & Team ID
```bash
cd apps/web
npx vercel link
cat .vercel/project.json
```

#### Render Deploy Hook
1. Go to your Render dashboard
2. Select your service
3. Go to **Settings** → **Deploy Hook**
4. Copy the deploy hook URL
5. Extract the hook ID from the URL

## Configuration Details

### Jobs

#### `validate_config`
- Installs CircleCI CLI
- Validates `.circleci/config.yml` syntax and structure
- Runs first to catch configuration errors early

#### `build_frontend`
- Uses Node.js 20.11 with pnpm
- Installs dependencies with caching
- Runs linting (`pnpm lint`)
- Runs type checking (`pnpm type-check`)
- Builds the Next.js application
- Persists build artifacts to workspace

#### `deploy_frontend`
- Attaches workspace from build job
- Installs Vercel CLI
- Pulls project configuration
- Builds for production
- Deploys to Vercel
- Only runs on `main` branch

#### `build_backend`
- Uses Python 3.11
- Creates virtual environment
- Installs dependencies with caching
- Runs Python syntax validation
- Persists venv to workspace

#### `deploy_backend`
- Triggers Render deployment via API
- Uses deploy hook for automatic deployment
- Only runs on `main` branch
- Skips gracefully if hook ID not configured

### Caching

The pipeline uses smart caching to speed up builds:

- **Frontend**: Caches pnpm store based on `package.json` hash
- **Backend**: Caches Python venv based on `requirements.txt` hash

### Deployment Triggers

- **All branches**: Build and test
- **`main` branch only**: Deploy to production

## Local Testing

### Validate Config Locally
```bash
circleci config validate
```

### Run Jobs Locally
```bash
# Validate config
circleci local execute --job validate_config

# Build frontend (requires Docker)
circleci local execute --job build_frontend

# Build backend
circleci local execute --job build_backend
```

Note: Local execution has limitations and doesn't support all features (contexts, workspaces, etc.)

## Workflow Execution

### Manual Trigger
Push to any branch:
```bash
git add .
git commit -m "Your changes"
git push origin your-branch
```

### View Pipeline
https://app.circleci.com/pipelines/github/YOUR_ORG/labs.teleports.cloud

### Manual Approval
Not currently configured, but can be added with approval jobs if needed.

## Troubleshooting

### Common Issues

#### "Context not found"
- Ensure you've created the `deployment-secrets` context
- Check context name matches exactly in config.yml

#### "Environment variable not set"
- Verify all required variables are added to the context
- Check variable names match exactly

#### "Vercel deployment failed"
- Verify VERCEL_TOKEN is valid
- Check that your Vercel project is properly linked
- Ensure you have deployment permissions

#### "Render deployment failed"
- Verify RENDER_API_KEY is valid
- Check RENDER_DEPLOY_HOOK_ID is correct
- Ensure Render service is properly configured

### Debug Commands

```bash
# Check CLI version
circleci version

# Validate config
circleci config validate

# View config processed
circleci config process .circleci/config.yml

# Test specific job locally
circleci local execute --job JOB_NAME
```

## Migration from Old Config

### What Changed

1. **Removed hardcoded secrets** - Now uses CircleCI contexts
2. **Added config validation** - Catches errors before builds run
3. **Improved caching** - Faster builds with smart dependency caching
4. **Better job separation** - Build and deploy are separate steps
5. **Branch filtering** - Only deploy from `main` branch
6. **Enhanced error handling** - Graceful failures for missing config

### Old vs New

| Feature | Old | New |
|---------|-----|-----|
| Secrets | Hardcoded in config | Secure context variables |
| Validation | None | Automatic CLI validation |
| Caching | Basic | Smart hash-based caching |
| Deployment | Always runs | Branch-filtered (main only) |
| Error handling | Basic | Enhanced with fallbacks |

## Security Best Practices

✅ **Do:**
- Store all secrets in CircleCI contexts
- Use branch protection for `main`
- Rotate API keys regularly
- Review pipeline logs for sensitive data

❌ **Don't:**
- Commit secrets to version control
- Share API keys in plain text
- Use personal tokens for production
- Disable security features

## Additional Resources

- [CircleCI Documentation](https://circleci.com/docs/)
- [CircleCI CLI Reference](https://circleci.com/docs/local-cli/)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Render API Documentation](https://render.com/docs/api)

## Support

For issues with:
- **CircleCI**: Check [CircleCI Support](https://support.circleci.com/)
- **Vercel**: See [Vercel Support](https://vercel.com/support)
- **Render**: Visit [Render Support](https://render.com/docs/support)

---

**Setup Date**: December 2025  
**Pipeline Status**: ✅ Active  
**Auto-deploy**: Enabled (main branch only)
