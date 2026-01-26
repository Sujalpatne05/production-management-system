import { test, expect } from '@playwright/test';

// Basic UI smoke test: confirms navigation on login submit
// Current Login page does not call backend; it navigates client-side.

test('Login page submits and navigates to dashboard overview', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'admin@doorsoft.co');
  await page.fill('#password', '123456');
  await page.getByRole('button', { name: 'SUBMIT' }).click();

  await page.waitForURL('**/dashboard/overview');
  await expect(page).toHaveURL(/.*\/dashboard\/overview$/);
});

test('Demo credentials quick arrow navigates to overview', async ({ page }) => {
  await page.goto('/login');

  // Click the ghost arrow button in demo table
  await page.getByRole('button', { name: '→' }).click();

  await page.waitForURL('**/dashboard/overview');
  await expect(page).toHaveURL(/.*\/dashboard\/overview$/);
});
