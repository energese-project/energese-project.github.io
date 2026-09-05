import { test, expect } from '@playwright/test';

test('the homepage states what the project is', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Energese Project/);
  await expect(page.locator('h1')).toContainText('One model');
});

test('every nav route renders its page', async ({ page }) => {
  await page.goto('/');

  for (const [label, heading] of [
    ['Projects', 'Projects'],
    ['Research', 'Research'],
    ['About', 'About'],
  ]) {
    await page.click(`site-nav a:text-is("${label}")`);
    await expect(page.locator('#router-outlet h1')).toHaveText(heading);
    await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}$`));
  }
});

test('the current route is marked in the nav', async ({ page }) => {
  await page.goto('/');
  await page.click('site-nav a:text-is("About")');
  await expect(page.locator('site-nav a[aria-current="page"]')).toHaveText('About');
});

// GitHub Pages serves 404.html for a path that is not a file, and the deploy
// workflow makes 404.html a copy of index.html. This asserts the property that
// arrangement depends on: a page entered directly at a deep URL boots and
// routes from window.location, without a redirect hop.
test('a deep link renders without going through the homepage first', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('#router-outlet h1')).toHaveText('Projects');
  await expect(page).toHaveURL(/\/projects$/);
});

test('an unknown path renders the 404 view', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.locator('#router-outlet')).toContainText('404');
});
