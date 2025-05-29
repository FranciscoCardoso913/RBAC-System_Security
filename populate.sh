#!/bin/bash

# Find the container ID or name that includes 'auth-server' and is running
CONTAINER=$(docker ps --filter "name=auth-server" --format "{{.Names}}" | head -n 1)

# Check if container was found
if [ -z "$CONTAINER" ]; then
  echo "Auth server container not found."
  exit 1
fi

# Run the seed script
echo "Running seed.js inside container: $CONTAINER"
docker exec "$CONTAINER" node seed.js
