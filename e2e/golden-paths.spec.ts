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

test('saved bookmark becomes a scraped card with tags', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'No account? Register' }).click();
  await page.getByLabel('Username').fill('e2e-user');
  await page.getByLabel('Password').fill('e2e-password-123');
  await page.getByRole('button', { name: 'Register', exact: true }).click();
  await expect(page.getByText('Start your reading list')).toBeVisible();

  await page.getByLabel('URL to save').fill('http://localhost:4000/page.html');
  await page.getByLabel('Tags, separated by commas').fill('react, docs');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page.getByRole('link', { name: 'Fixture Page' })).toBeVisible({
    timeout: 15_000,
  });
  await expect(
    page.getByText('A page served locally for E2E tests.'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'react', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'docs', exact: true }),
  ).toBeVisible();
});
