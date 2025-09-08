import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
  await context.storageState({ cookies: [], origins: [] });
});

  test('should show login button when not authenticated', async ({ page }) => {

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('banner').getByRole('heading', { level: 1, name: 'YouTube Digest' })
    ).toBeVisible();
    await expect(
      page.getByRole('banner').getByRole('heading', { level: 1, name: 'YouTube Digest' })
    ).toHaveCount(1);
    
    
    
    // Prove logged out state by absence of Sign Out
    await expect(page.getByRole('button', { name: /sign out/i })).toHaveCount(0);

    // Should see welcome message
    await expect(
      page.getByRole('main').getByRole('heading', { level: 1, name: /welcome to youtube digest/i })
    ).toBeVisible();
  });

  test('should show logout button when authenticated', async ({ page }) => {

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('banner').getByRole('heading', { level: 1, name: 'YouTube Digest' })
    ).toBeVisible();
    await expect(
      page.getByRole('banner').getByRole('heading', { level: 1, name: 'YouTube Digest' })
    ).toHaveCount(1);
    
    // Authenticated state is indicated by a Sign Out control
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    
    
  });
});
