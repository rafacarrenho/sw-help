import { test, expect } from '@playwright/test';

test('menu, filtros combinados e retorno da ficha preservam a busca', async ({ page }) => {
  await page.goto('/');
  const mobileMenu = page.getByRole('button', { name: 'Abrir menu' });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole('link', { name: 'Catálogo de Monstros' }).click();
  await expect(page.getByRole('heading', { name: 'Catálogo de Monstros' })).toBeVisible();
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await page.getByRole('searchbox').fill('tótemist');
  await page.getByLabel('Elemento', { exact: true }).selectOption('fire');
  await page.getByLabel('Estrelas naturais', { exact: true }).selectOption('5');
  await page.getByLabel('Forma', { exact: true }).selectOption('1');
  await expect(page.locator('[data-monster-card]')).toHaveCount(1);
  await expect(page.locator('[data-monster-card]')).toContainText('Nora');
  await page.locator('[data-monster-card]').click();
  await expect(page.getByRole('heading', { name: 'Nora', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Habilidade de líder' })).toBeVisible();
  await page.getByRole('link', { name: 'Todos os monstros' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('tótemist');
  await expect(page.locator('[data-monster-card]')).toHaveCount(1);
  await page.reload();
  await expect(page.getByLabel('Elemento', { exact: true })).toHaveValue('fire');
});

test('paginação, histórico, líder e estado vazio', async ({ page }) => {
  await page.goto('/monstros/');
  const firstName = await page.locator('[data-monster-card]').first().textContent();
  await page.getByRole('link', { name: 'Próxima' }).click();
  await expect(page).toHaveURL(/\/pagina\/2\//);
  await expect(page.locator('[data-monster-card]').first()).not.toHaveText(firstName!);
  await page.goBack();
  await expect(page.locator('[data-monster-card]').first()).toHaveText(firstName!);
  await page.getByLabel('Habilidade de líder', { exact: true }).selectOption('Attack Speed');
  await expect(page.locator('[data-monster-card]').first()).toContainText('SPD +');
  await page.getByRole('searchbox').fill('naoexiste123456');
  await expect(page.getByRole('heading', { name: 'Nenhum monstro encontrado' })).toBeVisible();
  await page.locator('[data-monster-empty]').getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await expect(page.getByRole('searchbox')).toBeFocused();
});

test('todos os registros paginam com URL válida e busca se recupera de falha', async ({ page }) => {
  await page.goto('/monstros/');
  await page.route('**/monstros/index.json', route => route.abort());
  await page.getByRole('searchbox').fill('nora');
  await expect(page.locator('[data-monster-error]')).toBeVisible();
  await page.unroute('**/monstros/index.json');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('[data-monster-card]').first()).toContainText('Nora');
  await page.goto('/monstros/?availability=all&page=60');
  await expect(page.locator('[data-page-label]')).toHaveText('Página 60 de 65');
  await page.getByRole('link', { name: 'Próxima' }).click();
  await expect(page).toHaveURL(/page=61/);
  const response = await page.reload();
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-page-label]')).toHaveText('Página 61 de 65');
});

test('fichas e paginação estática funcionam sem JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/monstros/`);
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await page.getByRole('link', { name: 'Próxima' }).click();
  await expect(page).toHaveURL(/\/pagina\/2\//);
  await page.locator('[data-monster-card]').first().click();
  await expect(page.getByRole('heading', { name: 'Habilidade de líder' })).toBeVisible();
  await context.close();
});

test('Siege referencia o catálogo e layout permanece legível', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/siege/mo-long-nora-triana/');
  await page.getByRole('link', { name: 'Ver Nora no catálogo' }).click();
  await expect(page).toHaveURL(/\/monstros\/nora\//);
  await expect(page.locator('.monster-profile img')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Na mesma família' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.goto('/monstros/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
});
