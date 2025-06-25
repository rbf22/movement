#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error.
# Return the exit code of the first failed command in a pipeline.
set -euo pipefail

echo "--- Starting environment setup for Playwright ---"

# 1. Check for Node.js and npm, install if not present

if ! command -v node > /dev/null || ! command -v npm > /dev/null; then
  echo "Node.js or npm not found. Attempting to install Node.js..."

  # Using NodeSource repository for a recent version of Node.js
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg

  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | \
    sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

  # Replace '20' with desired Node.js version if needed (e.g., 18, 22)
  NODE_MAJOR=20
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | \
    sudo tee /etc/apt/sources.list.d/nodesource.list > /dev/null

  sudo apt-get update
  sudo apt-get install -y nodejs

  echo "Node.js and npm installation completed."
else
  echo "Node.js and npm are already installed."
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

# 2. Install Playwright and its browser dependencies

echo "Installing Playwright test library and browser dependencies..."

# Create a package.json if it doesn’t exist
if [ ! -f package.json ]; then
  echo "Initializing npm project (creating package.json)..."
  npm init -y
fi

# Install Playwright test framework
npm install --save-dev @playwright/test

# Install required browser binaries and dependencies
npx playwright install --with-deps

echo "Playwright installation completed."

# 3. Verify Playwright can find its browsers

echo "Verifying Playwright installation by checking version..."
npx playwright --version

echo "--- Environment setup script finished ---"
echo "Playwright is installed and ready for use."
