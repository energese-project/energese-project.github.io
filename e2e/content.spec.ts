import { test, expect } from '@playwright/test';

test('the projects page lists all three repositories', async ({ page }) => {
  await page.goto('/projects');
  const cards = page.locator('#project-list article');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('GSSK');
  await expect(cards.nth(1)).toContainText('latex-energese');
  await expect(cards.nth(2)).toContainText('gssk-dia');
});

// Every card renders a repository link from data/projects.ts. A card whose
// links array failed to render would still show its blurb and look fine.
test('every project card links to its repository', async ({ page }) => {
  await page.goto('/projects');
  const repoLinks = page.locator('#project-list a[href^="https://github.com/energese-project/"]');
  await expect(repoLinks).toHaveCount(3);
});

test('the about page renders the full Odum symbol table', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('#symbol-rows tr')).toHaveCount(9);
});

// The paper's boundary conditions are the part most easily lost in an edit, and
// dropping them would turn an honest claim into an overclaim.
test('the research page keeps the emergy-algebra caveat', async ({ page }) => {
  await page.goto('/research');
  await expect(page.locator('#router-outlet')).toContainText(
    'not yet a faithful implementation of his emergy algebra'
  );
});

test('external links do not leak the referrer window', async ({ page }) => {
  await page.goto('/projects');
  const targets = await page.locator('a[target="_blank"]').all();
  expect(targets.length).toBeGreaterThan(0);
  for (const link of targets) {
    expect(await link.getAttribute('rel')).toContain('noopener');
  }
});
