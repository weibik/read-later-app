import { test, expect } from '@playwright/test';
import { registerAndLogin, resetState } from './helpers';

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
  await registerAndLogin(page);

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

test('clicking a tag chip filters the grid', async ({ page }) => {
  await registerAndLogin(page);

  await page.getByLabel('URL to save').fill('http://localhost:4000/page.html');
  await page.getByLabel('Tags, separated by commas').fill('react');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Fixture Page' })).toBeVisible({
    timeout: 15_000,
  });

  await page.getByLabel('URL to save').fill('http://localhost:4000/page2.html');
  await page.getByLabel('Tags, separated by commas').fill('docs');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Second Page' })).toBeVisible({
    timeout: 15_000,
  });

  const reactChip = page.getByRole('button', { name: 'react', exact: true });
  await reactChip.click();

  await expect(reactChip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: 'Fixture Page' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Second Page' }),
  ).not.toBeVisible();

  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Fixture Page' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Second Page' })).toBeVisible();
});

test('deleting a card removes it, and it stays gone after a reload', async ({
  page,
}) => {
  await registerAndLogin(page);

  await page.getByLabel('URL to save').fill('http://localhost:4000/page.html');
  await page.getByLabel('Tags, separated by commas').fill('react');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Fixture Page' })).toBeVisible({
    timeout: 15_000,
  });

  await page.getByRole('button', { name: 'Delete bookmark' }).click();

  await expect(
    page.getByRole('link', { name: 'Fixture Page' }),
  ).not.toBeVisible();
  await expect(page.getByText('Start your reading list')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Start your reading list')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Fixture Page' }),
  ).not.toBeVisible();
});
