#!/bin/bash
set -e

echo "🔐 Setting up CircleCI deployment secrets"
echo "=========================================="

# Store secrets securely
VERCEL_TOKEN="{{VERCEL_TOKEN}}"
VERCEL_PROJECT_ID="prj_A9oY7UnBUFrE41MOboCq4y1ryH30"
VERCEL_TEAM_ID="team_ukOUCjpIguZVPwMTYcvObu4n"
RENDER_API_KEY="{{RENDER_API_KEY}}"
RENDER_DEPLOY_HOOK_ID="srv-d4mk1kruibrs738liamg?key=Y9L44w8MnrU"

# Get organization info
echo "📋 Getting your CircleCI organization info..."
ORG_SLUG=$(circleci diagnostic | grep "Hello" | awk -F', ' '{print $2}' | tr '[:upper:]' '[:lower:]' | tr -d '.' | tr ' ' '-')

echo "Organization: $ORG_SLUG"
echo ""

# Create context
echo "📦 Creating 'deployment-secrets' context..."
CONTEXT_ID=$(curl -s -X POST \
  -H "Circle-Token: YOUR_CIRCLECI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"deployment-secrets\", \"owner\": {\"type\": \"organization\", \"slug\": \"$ORG_SLUG\"}}" \
  https://circleci.com/api/v2/context | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$CONTEXT_ID" ]; then
  echo "⚠️  Context might already exist, trying to get existing context ID..."
  CONTEXT_ID=$(curl -s -X GET \
    -H "Circle-Token: YOUR_CIRCLECI_API_KEY" \
    "https://circleci.com/api/v2/context?owner-slug=$ORG_SLUG" | \
    grep -o '"id":"[^"]*","name":"deployment-secrets"' | cut -d'"' -f4 | head -1)
fi

if [ -z "$CONTEXT_ID" ]; then
  echo "❌ Failed to create or find context. Please create it manually in CircleCI UI."
  echo "   https://app.circleci.com/settings/organization/github/$ORG_SLUG/contexts"
  exit 1
fi

echo "✅ Context ID: $CONTEXT_ID"
echo ""

# Add environment variables
echo "🔧 Adding environment variables to context..."

add_env_var() {
  local name=$1
  local value=$2
  
  echo "  → Adding $name..."
  response=$(curl -s -w "\n%{http_code}" -X PUT \
    -H "Circle-Token: YOUR_CIRCLECI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"value\": \"$value\"}" \
    "https://circleci.com/api/v2/context/$CONTEXT_ID/environment-variable/$name")
  
  http_code=$(echo "$response" | tail -n1)
  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo "    ✅ Success"
  else
    echo "    ⚠️  Failed (HTTP $http_code) - might already exist"
  fi
}

add_env_var "VERCEL_TOKEN" "$VERCEL_TOKEN"
add_env_var "VERCEL_PROJECT_ID" "$VERCEL_PROJECT_ID"
add_env_var "VERCEL_TEAM_ID" "$VERCEL_TEAM_ID"
add_env_var "RENDER_API_KEY" "$RENDER_API_KEY"
add_env_var "RENDER_DEPLOY_HOOK_ID" "$RENDER_DEPLOY_HOOK_ID"

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify variables at: https://app.circleci.com/settings/organization/github/$ORG_SLUG/contexts"
echo "2. Push changes to trigger a build:"
echo "   git add ."
echo "   git commit -m 'Configure CircleCI with deployment secrets'"
echo "   git push origin main"
echo ""
echo "3. Monitor your pipeline at:"
echo "   https://app.circleci.com/pipelines/github/$ORG_SLUG/labs.teleports.cloud"
