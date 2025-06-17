#!/bin/bash

# Deploy script for Fly.io
set -e

echo "🚀 Starting deployment to Fly.io..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI is not installed. Please install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if user is logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ You are not logged in to Fly.io. Please run:"
    echo "   fly auth login"
    exit 1
fi

# Check if app exists, if not create it
if ! fly apps list | grep -q "waving-test-api"; then
    echo "📱 Creating new Fly.io app..."
    fly apps create waving-test-api --org personal
fi

# Set secrets if they exist in .env file
if [ -f .env ]; then
    echo "🔐 Setting environment variables from .env file..."
    # Read .env file and set secrets
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ ! $key =~ ^# ]] && [[ -n $key ]]; then
            # Remove quotes from value
            value=$(echo $value | sed 's/^"//;s/"$//;s/^'"'"'//;s/'"'"'$//')
            echo "Setting $key..."
            fly secrets set "$key=$value" --app waving-test-api
        fi
    done < .env
fi

# Deploy the application
echo "🚀 Deploying to Fly.io..."
fly deploy --app waving-test-api

echo "✅ Deployment completed!"
echo "🌐 Your app is available at: https://waving-test-api.fly.dev"
echo "📊 Check status with: fly status --app waving-test-api"
echo "📝 View logs with: fly logs --app waving-test-api" 