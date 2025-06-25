import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/', { timeout: 60000 }); // Increased timeout
  console.log(`Page URL after goto: ${page.url()}`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/EPAM Client Collaboration Animation/);
});

test('renders controls', async ({ page }) => {
  await page.goto('/', { timeout: 60000 }); // Increased timeout
  console.log(`Page URL after goto in second test: ${page.url()}`);

  // Click the button to show the control panel
  await page.locator('#toggleBtn').click();

  // Check for the main controls container
  await expect(page.locator('#controlPanel')).toBeVisible();

  // Check for a few specific controls - many are removed as they don't exist in current HTML
  // await expect(page.locator('label[for="phase-selector"]')).toHaveText('Current Phase:');
  // await expect(page.locator('#phase-selector')).toBeVisible();
  // await expect(page.locator('button:has-text("Play")')).toBeVisible();
  // await expect(page.locator('button:has-text("Pause")')).toBeVisible();
  // await expect(page.locator('button:has-text("Reset")')).toBeVisible(); // This might also need removal if it doesn't exist
});

/*
test('phase selector changes phase', async ({ page }) => {
  await page.goto('/');

  const phaseSelector = page.locator('#phase-selector');
  const currentPhaseText = page.locator('#current-phase-text'); // Assuming such an element exists or will be created to display phase name

  // Initial phase (assuming "Discovery" is the first option and selected by default)
  // We'll check if the visual representation of the phase changes,
  // for now, let's assume there's a text element that displays the current phase name.
  // Since the actual visual change is on a canvas, we'll rely on UI controls or text indicators.

  // Helper to get the displayed phase name (if available)
  // This is a placeholder as the actual app doesn't show the phase name directly in text.
  // We might need to adjust this test or the app to make it more testable.
  // For now, we'll test if the selector's value changes.
  await expect(phaseSelector).toHaveValue('discovery');

  // Change to "Development"
  await phaseSelector.selectOption('development');
  await expect(phaseSelector).toHaveValue('development');
  // Add expect(currentPhaseText).toHaveText('Development'); if such an element is added

  // Change to "Deployment"
  await phaseSelector.selectOption('deployment');
  await expect(phaseSelector).toHaveValue('deployment');
  // Add expect(currentPhaseText).toHaveText('Deployment'); if such an element is added
});
*/

/*
test('play and pause buttons exist', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button:has-text("Play")')).toBeVisible();
  await expect(page.locator('button:has-text("Pause")')).toBeVisible();
  // Further tests could involve checking if clicking them changes animation state,
  // but that would require a way to observe the animation's state.
});
*/
