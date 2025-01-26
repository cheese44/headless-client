import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('check that categories are shown', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header nav a').first()).toBeVisible();
})
test('check that posts are shown', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.post-card').first()).toBeVisible();
})
test('check post card navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.post-card').first().waitFor();
  await page.getByText('Read more...').first().click();
  await expect(page.locator('.post-details').first()).toBeVisible();
})
test('check category navigation', async ({ page }) => {
  await page.goto('/');
  await page.locator('.post-card').first().waitFor();
  const elementsCount = await page.locator('.post-card').count()

  await page.locator('header nav a').first().click();
  await page.waitForTimeout(2000);
  await expect(await page.locator('.post-card').count()).toBeLessThan(elementsCount);
})
