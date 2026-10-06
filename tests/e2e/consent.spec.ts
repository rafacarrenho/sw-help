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
  expect(
    await page
      .locator('body')
      .evaluate((element) => getComputedStyle(element).overflow !== 'hidden'),
  ).toBe(true);
  expect(
    await layer.evaluate((element) => {
      const hit = document.elementFromPoint(window.innerWidth - 2, 2);
      return hit === element || (hit !== null && element.contains(hit));
    }),
  ).toBe(false);

  await page.getByRole('link', { name: 'Choose a game' }).click();
  await expect(page).toHaveURL(/#games$/);
  await expect(notice).toBeVisible();

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

test('primeira camada permite continuar a navegação por teclado', async ({
  page,
}) => {
  await page.goto('/');

  const notice = page.locator('[data-privacy-notice]');
  const acceptAll = notice.getByRole('button', { name: 'Accept all' });

  await expect(acceptAll).toBeFocused();
  await page.keyboard.press('Tab');
  expect(
    await notice.evaluate(
      (element) => !element.contains(document.activeElement),
    ),
  ).toBe(true);
});
