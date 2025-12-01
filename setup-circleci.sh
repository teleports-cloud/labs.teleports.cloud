#!/bin/bash
set -e

# CircleCI Setup Script
# This script configures CircleCI for your project using the CircleCI CLI

echo "🔧 Setting up CircleCI for labs.teleports.cloud"
echo "================================================"

# Store API key securely
CIRCLECI_API_KEY="{{CIRCLECI_API_KEY}}"

# Check if CircleCI CLI is installed
if ! command -v circleci &> /dev/null; then
    echo "📥 Installing CircleCI CLI..."
    curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/main/install.sh | bash
else
    echo "✅ CircleCI CLI already installed"
fi

# Configure CircleCI CLI
echo ""
echo "🔐 Configuring CircleCI CLI..."
circleci setup

# Validate the configuration
echo ""
echo "✅ Validating CircleCI configuration..."
circleci config validate

echo ""
echo "📋 Next steps:"
echo "1. Create a context named 'deployment-secrets' in CircleCI:"
echo "   https://app.circleci.com/settings/project/github/YOUR_ORG/labs.teleports.cloud/contexts"
echo ""
echo "2. Add the following environment variables to the 'deployment-secrets' context:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_PROJECT_ID (if using specific project)"
echo "   - VERCEL_TEAM_ID (if using teams)"
echo "   - RENDER_API_KEY"
echo "   - RENDER_DEPLOY_HOOK_ID"
echo ""
echo "3. Push your changes to trigger a build:"
echo "   git add .circleci/config.yml"
echo "   git commit -m 'Refactor to use CircleCI for build and deploy'"
echo "   git push origin main"
echo ""
echo "4. Monitor your build at:"
echo "   https://app.circleci.com/pipelines/github/YOUR_ORG/labs.teleports.cloud"
echo ""
echo "✨ CircleCI setup complete!"
