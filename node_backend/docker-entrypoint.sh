#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
# Wait for PostgreSQL to be ready
until nc -z -v -w30 $DB_HOST $DB_PORT; do
  echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
  sleep 2
done
echo "PostgreSQL is ready!"

# Run database migrations
echo "Running database migrations..."
node dist/database/migrate.js

# Start the application
echo "Starting the application..."
node dist/server.js 