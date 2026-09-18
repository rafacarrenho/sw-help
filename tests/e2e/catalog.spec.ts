import { test, expect } from '@playwright/test';

test('busca combinada, URL, detalhe e retorno preservam a seleção', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Spd Tuning' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Spd Tick' })).toBeDisabled();
  await page.getByRole('searchbox').fill('CLÁRA, carcano');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await page.getByLabel('Torre 4★', { exact: true }).check();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(1);
  await expect(page).toHaveURL(/tower=4star/);
  await page
    .getByRole('link', { name: 'Ver counters de Carcano · Clara · Kinki' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Esta defesa ainda não tem counters' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Todas as defesas' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('CLÁRA, carcano');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(1);
  await page.reload();
  await expect(page.getByLabel('Torre 4★', { exact: true })).toBeChecked();
});
test('estado vazio permite limpar busca e filtro', async ({ page }) => {
  await page.goto('/?q=inexistente&tower=4star');
  await expect(
    page.getByRole('heading', { name: 'Nenhuma defesa encontrada' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(8);
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(page).toHaveURL('http://127.0.0.1:4321/');
});
test('detalhes, recursos locais e layout funcionam sem erros', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/siege/mo-long-nora-triana/');
  await expect(page.locator('.counter-card')).toHaveCount(2);
  await expect(
    page.getByText(
      'Demonstração de cadastro. Este matchup ainda não foi validado.',
    ),
  ).toHaveCount(2);
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
  await expect(page.locator('[data-defense-card]')).toHaveCount(8);
  await page
    .getByRole('link', { name: 'Ver counters de Mo Long · Nora · Triana' })
    .click();
  await expect(page.locator('.counter-card')).toHaveCount(2);
  await context.close();
});
