#!/bin/bash

echo "🚀 Running Infrastructure Validation..."

# Check if docker-compose.yml is valid
if docker compose config > /dev/null 2>&1; then
    echo "✅ Docker Compose configuration is valid."
else
    echo "❌ ERROR: Your docker-compose.yml has syntax errors!"
    exit 1
fi

# Check if the 'api' service exists in docker-compose
if docker compose config | grep -q "api:"; then
    echo "✅ 'api' service detected in docker-compose.yml."
else
    echo "❌ ERROR: Missing 'api' service in docker-compose.yml!"
    exit 1
fi

# Check if Dockerfile exists
if [ -f "./backend/Dockerfile" ]; then
    echo "✅ Dockerfile found in backend directory."
else
    echo "❌ ERROR: Could not find backend/Dockerfile!"
    exit 1
fi

echo "🎉 Infrastructure check passed! Now try running: docker compose up --build"
