import { test, expect } from '@playwright/test';
import { resetState } from './helpers';

test.beforeEach(async () => {
  await resetState();
});

test('new user can register and see the empty feed', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  await page.getByRole('button', { name: 'No account? Register' }).click();
  await expect(
    page.getByRole('heading', { name: 'Create account' }),
  ).toBeVisible();

  await page.getByLabel('Username').fill('e2e-user');
  await page.getByLabel('Password').fill('e2e-password-123');
  await page.getByRole('button', { name: 'Register', exact: true }).click();

  await expect(page.getByText('Start your reading list')).toBeVisible();
  await expect(
    page.getByText('Paste a link above to save your first page.'),
  ).toBeVisible();
});
