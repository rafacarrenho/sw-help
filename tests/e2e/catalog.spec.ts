import { test, expect } from '@playwright/test';

test('busca combinada, URL, detalhe e retorno preservam a seleção', async ({
  page,
}) => {
  await page.goto('/');
  const mobileMenu = page.getByRole('button', { name: 'Abrir menu' });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Spd Tuning' })).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Spd Tick' })).toHaveAttribute(
    'href',
    '/spd-tick/',
  );
  const mobileClose = page.locator('[data-mobile-menu-close]');
  if (await mobileClose.isVisible()) await mobileClose.click();
  await page.getByRole('searchbox').fill('MORRIS, trevor');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await page.getByLabel('Torre 4★', { exact: true }).check();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await expect(page).toHaveURL(/tower=4star/);
  await page
    .getByRole('link', { name: 'Ver counters de Morris · Trevor · Figaro' })
    .click();
  await expect(page.locator('.counter-card')).toHaveCount(4);
  await page.getByRole('link', { name: 'Todas as defesas' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('MORRIS, trevor');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel('Torre 4★', { exact: true })).toBeChecked();
});
test('estado vazio permite limpar busca e filtro', async ({ page }) => {
  await page.goto('/?q=inexistente&tower=4star');
  await expect(
    page.getByRole('heading', { name: 'Nenhuma defesa encontrada' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(6);
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
});
test('detalhes, recursos locais e layout funcionam sem erros', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/siege/morris-eshir-orion/');
  await expect(page.locator('.counter-card')).toHaveCount(4);
  const defenseTeam = page.locator('.defense-team-panel .monster-team');
  await expect(defenseTeam.locator('[data-team-leader-icon]')).toHaveAttribute(
    'src',
    '/leader-skills/attack-speed.png',
  );
  await expect(
    defenseTeam.locator('.monster').nth(1).locator('[data-team-leader-icon]'),
  ).toHaveCount(0);
  const firstCounter = page.locator('.counter-card').first();
  await expect(firstCounter.locator('[data-team-leader-icon]')).toHaveCount(1);
  await expect(firstCounter.locator('[data-team-leader-icon]')).toHaveAttribute(
    'alt',
    'Líder da composição',
  );
  await expect(
    page.getByText('Os exemplos não garantem vitória.', { exact: false }),
  ).toBeVisible();
  for (const image of await page.locator('.monster-portrait img').all()) {
    await image.scrollIntoViewIfNeeded();
  }
  await expect
    .poll(() =>
      page
        .locator('.monster-portrait img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBeTruthy();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
test('catálogo e detalhes são navegáveis sem JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('[data-defense-card]')).toHaveCount(6);
  await page
    .getByRole('link', { name: 'Ver counters de Morris · Eshir · Orion' })
    .click();
  await expect(page.locator('.counter-card')).toHaveCount(4);
  await context.close();
});
