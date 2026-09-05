import { test, expect } from '@playwright/test';

const LIGHT_GROUND = 'rgb(251, 250, 247)';
const DARK_GROUND = 'rgb(16, 23, 22)';
const DARK_SURFACE = 'rgb(26, 35, 33)';

const bodyBg = () =>
  document.defaultView!.getComputedStyle(document.body).backgroundColor;

test.describe('light', () => {
  test.use({ colorScheme: 'light' });

  test('the page takes the warm light ground', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(bodyBg)).toBe(LIGHT_GROUND);
  });
});

test.describe('dark', () => {
  test.use({ colorScheme: 'dark' });

  test('the page takes the dark ground', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(bodyBg)).toBe(DARK_GROUND);
  });

  // The pipeline diagram's boxes were fill="#fff", which survives a token
  // migration untouched and then glows white on a dark page. Nothing else here
  // inspects SVG, so this is the only thing standing between that and a
  // shipped regression.
  test('no SVG shape is painted a hardcoded white', async ({ page }) => {
    await page.goto('/');
    const fills = await page.$$eval('#router-outlet svg rect, #router-outlet svg circle, #router-outlet svg path', (els) =>
      els.map((el) => getComputedStyle(el).fill)
    );
    expect(fills.length).toBeGreaterThan(0);
    expect(fills.filter((f) => f === 'rgb(255, 255, 255)')).toEqual([]);
  });

  test('the diagram boxes use the surface token', async ({ page }) => {
    await page.goto('/');
    const fills = await page.$$eval('#router-outlet figure svg rect[rx="10"]', (els) =>
      els.map((el) => getComputedStyle(el).fill)
    );
    expect(fills.filter((f) => f === DARK_SURFACE).length).toBeGreaterThan(0);
  });

  // The primary button was ink-on-white with white text. --e-ink is near-white
  // in dark mode, so that pairing inverts into white-on-white. The accent and
  // the ground token invert together, which is why the button uses those.
  test('the primary call to action stays legible', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('#router-outlet a[href="/projects"]').first();
    const colours = await cta.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, fg: cs.color };
    });
    expect(colours.bg).toBe('rgb(45, 212, 191)');
    expect(colours.fg).toBe(DARK_GROUND);
  });
});

// The token file is duplicated into the GSSK repository. The version token is
// how a stale copy is spotted, so losing it silently would remove the only
// signal that the two have drifted.
test('the tokens carry a version', async ({ page }) => {
  await page.goto('/');
  const version = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--e-tokens-version').trim()
  );
  expect(version).not.toBe('');
});
