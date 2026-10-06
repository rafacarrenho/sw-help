import type { Page } from '@playwright/test';

export async function seedEssentialPrivacyPreferences(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'playerdojo:privacy-preferences',
      JSON.stringify({
        version: 1,
        analytics: false,
        personalizedAds: false,
        updatedAt: '2026-10-06T12:00:00.000Z',
      }),
    );
  });
}
