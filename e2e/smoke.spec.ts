import { test, expect } from '@playwright/test';

test('shows the login page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
