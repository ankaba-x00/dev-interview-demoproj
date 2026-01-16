#!/usr/bin/env bash
set -e

MONGO_HOST="$1"
shift

echo "Waiting for MongoDB at $MONGO_HOST..."

until nc -z "$MONGO_HOST" 27017; do
  echo "MongoDB not reachable yet - sleeping"
  sleep 2
done

echo "MongoDB is reachable."
echo "Starting backend..."
exec "$@"
