#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting environment setup for Playwright ---"

# 1. Check for Node.js and npm, install if not present
# Playwright is a Node.js library, so Node.js and npm are required.
if ! command -v node > /dev/null || ! command -v npm > /dev/null; then
  echo "Node.js or npm not found. Attempting to install Node.js..."
  # Using NodeSource repository for a recent version of Node.js
  # This is a common way to install Node.js on Debian/Ubuntu.
  # Adjust if using a different OS or Node version manager (like nvm).
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  sudo mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

  # Replace 'node_20.x' with your desired Node.js version, e.g., 'node_18.x', 'node_22.x'
  NODE_MAJOR=20
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

  sudo apt-get update
  sudo apt-get install nodejs -y
  echo "Node.js and npm installation attempted."
else
  echo "Node.js and npm are already installed."
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

# 2. Install Playwright and its browser dependencies
echo "Installing Playwright test library and browser dependencies..."
# Create a package.json if it doesn't exist, or Playwright install might complain
if [ ! -f package.json ]; then
  echo "Initializing npm project (creating package.json)..."
  npm init -y
fi

npm install --save-dev @playwright/test

# Install browser dependencies required by Playwright.
# The '--with-deps' flag attempts to install OS packages needed by the browsers.
npx playwright install --with-deps

echo "Playwright installation attempted."

# 3. Verify Playwright can find its browsers (basic check)
echo "Verifying Playwright installation by listing browsers..."
# This command helps to see if Playwright recognizes its installed browsers.
# It doesn't run tests but checks a part of Playwright's setup.
npx playwright --version

# 4. Optional: Run a very simple Playwright test execution (if tests exist)
# This assumes you have a 'playwright.config.ts' and some tests in './tests'
if [ -f playwright.config.ts ] && [ -d tests ]; then
  echo "Attempting to run Playwright tests as a final check..."
  # This might still fail if the webServer command (python3 -m http.server) has issues
  # or if the tests themselves have problems, but it's a good smoke test.
  npx playwright test
  echo "Playwright test command executed."
else
  echo "No 'playwright.config.ts' or 'tests' directory found, skipping test run."
  echo "To fully test, ensure your Playwright project is configured and has tests."
fi

echo "--- Environment setup script finished ---"
echo "If all steps completed without error, Playwright should be ready."
echo "If 'npx playwright test' was run and failed, further debugging of the tests or web server configuration might be needed."
