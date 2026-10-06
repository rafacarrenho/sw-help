import { expect, test } from '@playwright/test';

test('production pages initialize Google Analytics once', async ({ page }) => {
  const googleTagRequests: string[] = [];

  await page.route('https://www.googletagmanager.com/**', async (route) => {
    googleTagRequests.push(route.request().url());
    await route.fulfill({
      contentType: 'application/javascript',
      body: '',
    });
  });

  await page.goto('/');

  await expect
    .poll(() => googleTagRequests)
    .toEqual(['https://www.googletagmanager.com/gtag/js?id=G-QTMVTJP8FE']);
  await expect(page.locator('script[data-playerdojo-ga]')).toHaveCount(1);

  const analyticsConfig = await page.evaluate(() => {
    const analyticsWindow = window as typeof window & {
      dataLayer?: IArguments[];
    };

    return analyticsWindow.dataLayer?.map((entry) => Array.from(entry));
  });

  expect(analyticsConfig?.[1]).toEqual([
    'config',
    'G-QTMVTJP8FE',
    { anonymize_ip: true },
  ]);
});
