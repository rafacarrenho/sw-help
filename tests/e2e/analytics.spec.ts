import { expect, test, type Page } from '@playwright/test';

const googleTagUrl = 'https://www.googletagmanager.com/gtag/js?id=G-QTMVTJP8FE';

async function trackGoogleTagRequests(page: Page) {
  const requests: string[] = [];
  await page.route('https://www.googletagmanager.com/**', async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      contentType: 'application/javascript',
      body: '',
    });
  });
  return requests;
}

test('analytics continua opcional e inicializa uma única vez', async ({
  page,
}) => {
  const googleTagRequests = await trackGoogleTagRequests(page);

  await page.goto('/');
  await expect(page.locator('[data-privacy-notice]')).toBeVisible();
  expect(googleTagRequests).toEqual([]);
  await expect(page.locator('script[data-playerdojo-ga]')).toHaveCount(0);

  await page
    .locator('[data-privacy-notice]')
    .getByRole('button', { name: 'Cookie settings' })
    .click();
  await page.getByLabel('Analytics').check();
  await page.getByLabel('Personalized advertising').check();
  await page.getByRole('button', { name: 'Confirm my choices' }).click();

  await expect.poll(() => googleTagRequests).toEqual([googleTagUrl]);
  await expect(page.locator('script[data-playerdojo-ga]')).toHaveCount(1);
  await expect(page.locator('[data-privacy-notice]')).toBeHidden();

  const preferences = await page.evaluate(() =>
    JSON.parse(
      window.localStorage.getItem('playerdojo:privacy-preferences') ?? '{}',
    ),
  );
  expect(preferences).toMatchObject({
    version: 1,
    analytics: true,
    personalizedAds: true,
  });

  const analyticsConfig = await page.evaluate(() => {
    const analyticsWindow = window as typeof window & {
      dataLayer?: IArguments[];
    };
    return analyticsWindow.dataLayer?.map((entry) => Array.from(entry));
  });
  expect(analyticsConfig?.find((entry) => entry[0] === 'config')).toEqual([
    'config',
    'G-QTMVTJP8FE',
    { anonymize_ip: true },
  ]);

  await page.getByRole('button', { name: 'Cookie settings' }).click();
  await expect(page.getByLabel('Analytics')).toBeChecked();
  await page.getByRole('button', { name: 'Accept all' }).click();
  await expect.poll(() => googleTagRequests).toEqual([googleTagUrl]);
});

test('analytics pode ser revogado sem alterar a escolha de publicidade', async ({
  page,
}) => {
  const googleTagRequests = await trackGoogleTagRequests(page);

  await page.goto('/pt');
  await page.getByRole('button', { name: 'Aceitar tudo' }).click();
  await expect.poll(() => googleTagRequests).toEqual([googleTagUrl]);

  await page.getByRole('button', { name: 'Preferências de cookies' }).click();
  await page.getByLabel('Analytics').uncheck();
  await page.getByRole('button', { name: 'Confirmar minhas escolhas' }).click();

  expect(
    await page.evaluate(() =>
      JSON.parse(
        window.localStorage.getItem('playerdojo:privacy-preferences') ?? '{}',
      ),
    ),
  ).toMatchObject({ analytics: false, personalizedAds: true });

  await page.reload();
  await expect(page.locator('[data-privacy-notice]')).toBeHidden();
  await expect(page.locator('script[data-playerdojo-ga]')).toHaveCount(0);
  expect(googleTagRequests).toEqual([googleTagUrl]);
});

test('preferência armazenada carrega analytics na próxima navegação', async ({
  page,
}) => {
  const googleTagRequests = await trackGoogleTagRequests(page);
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'playerdojo:privacy-preferences',
      JSON.stringify({
        version: 1,
        analytics: true,
        personalizedAds: true,
        updatedAt: new Date().toISOString(),
      }),
    );
  });

  await page.goto('/summoners-war');

  await expect.poll(() => googleTagRequests).toEqual([googleTagUrl]);
  await expect(page.locator('[data-privacy-notice]')).toBeHidden();
});
