import { test, expect } from '@playwright/test';
import { resetState } from './helpers';

test.beforeEach(async () => {
  await resetState();
});

test('shows the login page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});
