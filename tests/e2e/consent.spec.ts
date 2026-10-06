import { expect, test } from '@playwright/test';

test('primeira camada abre configurações sem salvar uma escolha', async ({
  page,
}) => {
  await page.goto('/');

  const layer = page.locator('[data-privacy-choice-layer]');
  const notice = page.locator('[data-privacy-notice]');
  const modal = page.getByRole('dialog', {
    name: 'Manage privacy preferences',
  });
  await expect(layer).toBeVisible();
  await expect(notice).toBeVisible();
  await expect(
    notice.getByRole('button', { name: 'Cookie settings' }),
  ).toBeVisible();
  await expect(
    notice.getByRole('button', { name: 'Accept all' }),
  ).toBeVisible();
  await expect(
    notice.getByRole('button', { name: 'Accept all' }),
  ).toBeFocused();
  await expect(page.locator('body')).toHaveClass(/privacy-choice-required/);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  expect(
    await layer.evaluate((element) => {
      const hit = document.elementFromPoint(window.innerWidth - 2, 2);
      return hit === element || (hit !== null && element.contains(hit));
    }),
  ).toBe(true);

  await page.keyboard.press('Escape');
  await expect(layer).toBeVisible();
  await expect(notice).toBeVisible();

  await notice.getByRole('button', { name: 'Cookie settings' }).click();
  await expect(notice).toBeHidden();
  await expect(modal).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Close privacy settings' }),
  ).toBeFocused();
  await expect(page.getByText('Always active')).toBeVisible();
  await expect(page.getByLabel('Personalized advertising')).not.toBeChecked();
  await expect(page.getByLabel('Analytics')).not.toBeChecked();

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(layer).toBeVisible();
  await expect(notice).toBeVisible();
  await expect(
    notice.getByRole('button', { name: 'Cookie settings' }),
  ).toBeFocused();
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('playerdojo:privacy-preferences'),
    ),
  ).toBeNull();
});

test('aceitar tudo ativa as duas categorias opcionais', async ({ page }) => {
  await page.goto('/pt');
  await page.getByRole('button', { name: 'Aceitar tudo' }).click();

  expect(
    await page.evaluate(() =>
      JSON.parse(
        window.localStorage.getItem('playerdojo:privacy-preferences') ?? '{}',
      ),
    ),
  ).toMatchObject({ analytics: true, personalizedAds: true });
  await expect(page.locator('[data-privacy-choice-layer]')).toBeHidden();
  await expect(page.locator('[data-privacy-notice]')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/privacy-choice-required/);
});

test('rodapé abre o modal com escolhas atuais e fechar não altera dados', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'playerdojo:privacy-preferences',
      JSON.stringify({
        version: 1,
        analytics: false,
        personalizedAds: true,
        updatedAt: '2026-10-06T12:00:00.000Z',
      }),
    );
  });
  await page.goto('/');

  const settingsButton = page.getByRole('button', { name: 'Cookie settings' });
  await settingsButton.click();
  await expect(page.getByLabel('Personalized advertising')).toBeChecked();
  await expect(page.getByLabel('Analytics')).not.toBeChecked();

  await page.getByLabel('Analytics').check();
  await page.getByRole('button', { name: 'Close privacy settings' }).click();
  await expect(settingsButton).toBeFocused();
  expect(
    await page.evaluate(() =>
      JSON.parse(
        window.localStorage.getItem('playerdojo:privacy-preferences') ?? '{}',
      ),
    ),
  ).toMatchObject({ analytics: false, personalizedAds: true });
});

test('modal mantém o foco dentro das configurações', async ({ page }) => {
  await page.goto('/');
  await page
    .locator('[data-privacy-notice]')
    .getByRole('button', { name: 'Cookie settings' })
    .click();

  const close = page.getByRole('button', { name: 'Close privacy settings' });
  const confirm = page.getByRole('button', { name: 'Confirm my choices' });
  await close.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(confirm).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
});

test('primeira camada mantém o foco dentro das escolhas obrigatórias', async ({
  page,
}) => {
  await page.goto('/');

  const notice = page.locator('[data-privacy-notice]');
  const privacyLink = notice.getByRole('link', { name: 'Privacy Policy' });
  const acceptAll = notice.getByRole('button', { name: 'Accept all' });

  await privacyLink.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(acceptAll).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(privacyLink).toBeFocused();
});
