#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Start the Node.js development server in the background
echo "Starting Node.js server..."
npm run dev &

# Wait for a few seconds to allow MongoDB and the backend to initialize
echo "Waiting for services to be ready..."
sleep 15 # Adjust this time as needed

# Run the seed script
echo "Running database seed script..."
npm run seed

# Wait for the main backend process (npm run dev) to exit
echo "Backend and seed script started. Waiting for server to exit."
wait