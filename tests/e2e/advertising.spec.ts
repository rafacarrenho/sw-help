import { expect, test } from '@playwright/test';

test('todas as páginas públicas renderizam o placement Adsterra', async ({
  page,
}) => {
  for (const path of [
    '/',
    '/privacy',
    '/summoners-war',
    '/summoners-war/speed-tick',
    '/pt',
    '/pt/privacidade',
  ]) {
    await page.goto(path);
    await expect(page.locator('[data-adsterra-slot]')).toHaveCount(1);
  }
});

test('anúncio personalizado só carrega depois da escolha correspondente', async ({
  page,
}) => {
  await page.goto('/');
  const slot = page.locator('[data-adsterra-slot]');
  await slot.evaluate((element) => {
    element.dataset.personalizedKey = 'test-placement';
    element.dataset.personalizedScriptUrl =
      'https://ads.example.test/invoke.js';
    element.dataset.personalizedConfigured = 'true';
  });

  await expect(slot.locator('iframe[data-adsterra-frame]')).toHaveCount(0);
  await page
    .locator('[data-privacy-notice]')
    .getByRole('button', { name: 'Cookie settings' })
    .click();
  await page.getByLabel('Personalized advertising').check();
  await page.getByRole('button', { name: 'Confirm my choices' }).click();

  await expect(slot).toBeVisible();
  await expect(slot).toHaveAttribute('data-adsterra-mode', 'personalized');
  await expect(slot).toHaveAttribute(
    'data-adsterra-state',
    /loading|loaded|error/,
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(
        window.localStorage.getItem('playerdojo:privacy-preferences') ?? '{}',
      ),
    ),
  ).toMatchObject({
    version: 1,
    analytics: false,
    personalizedAds: true,
  });
});

test('somente necessários não carrega o tag personalizado', async ({
  page,
}) => {
  await page.goto('/pt');
  const slot = page.locator('[data-adsterra-slot]');
  await slot.evaluate((element) => {
    element.dataset.personalizedKey = 'test-placement';
    element.dataset.personalizedScriptUrl =
      'https://ads.example.test/invoke.js';
    element.dataset.personalizedConfigured = 'true';
  });

  await page.getByRole('button', { name: 'Configurar cookies' }).click();
  await page.getByRole('button', { name: 'Somente necessários' }).click();

  await expect(slot).toBeHidden();
  await expect(slot.locator('iframe[data-adsterra-frame]')).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          window.localStorage.getItem('playerdojo:privacy-preferences') ?? '{}',
        ).personalizedAds,
    ),
  ).toBe(false);
});
