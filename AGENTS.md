## Frontend Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

### Running Tests

**Prerequisites:**
*   Node.js (LTS version recommended)
*   npm (comes with Node.js)

**1. Install Dependencies:**
   If this is the first time or `package.json` has changed, install the necessary packages:
   ```bash
   npm ci
   ```

**2. Install Playwright Browsers:**
   Playwright needs browser binaries to run tests. If they are not already installed, or to ensure you have the correct versions:
   ```bash
   npx playwright install --with-deps
   ```
   The `--with-deps` flag will also install necessary operating system dependencies.

**3. Run Tests:**
   To execute all tests, run:
   ```bash
   npm test
   ```
   This command will launch a simple Python HTTP server to serve the `index.html` and then run the Playwright tests against it. Tests will run in headless mode by default across Chromium, Firefox, and WebKit as configured in `playwright.config.ts`.

**4. View Test Report:**
   After tests complete, an HTML report is generated in the `playwright-report` directory. You can open it manually, or use the following command to serve it:
   ```bash
   npx playwright show-report
   ```

**5. Run Tests in UI Mode (for debugging and development):**
   Playwright offers a UI mode that allows you to watch tests run, inspect selectors, and debug:
   ```bash
   npm run test:ui
   ```

### Test Configuration

*   **Test files:** Located in the `tests/` directory.
*   **Playwright configuration:** `playwright.config.ts` in the root directory. This file defines:
    *   Browsers to test against (Chromium, Firefox, WebKit are configured).
    *   The base URL for the tests.
    *   The command to start the web server (`python3 -m http.server 8000`).
    *   Other test execution parameters like retries, parallel workers, etc.

### GitHub Actions CI

A GitHub Actions workflow is set up in `.github/workflows/playwright.yml`. This workflow automatically runs all tests on every push and pull request to the `main` or `master` branches. It will:
1.  Checkout the code.
2.  Set up Node.js.
3.  Install npm dependencies (`npm ci`).
4.  Install Playwright browsers.
5.  Run Playwright tests (`npx playwright test`).
6.  Upload the Playwright report as an artifact.

### Notes for Jules (AI Agent)

*   The local test execution in the development sandbox environment has shown inconsistencies, particularly with Node.js module resolution for Playwright.
*   The primary verification of test success should be through the GitHub Actions workflow.
*   When modifying tests or adding new ones:
    *   Ensure they are placed in the `tests/` directory.
    *   Follow Playwright best practices for writing selectors and assertions.
    *   If changes are made to the application's serving mechanism or port, update `playwright.config.ts` (specifically the `webServer` and `use.baseURL` sections).
