import { test, expect } from '@playwright/test';

test('inglês ocupa a raiz e português fica sob /pt', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByText('A strong offense starts before the battle.'),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://sw-help.rafabcarrenho.workers.dev/',
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://sw-help.rafabcarrenho.workers.dev/',
  );
  await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute(
    'href',
    'https://sw-help.rafabcarrenho.workers.dev/pt/',
  );

  await page.goto('/pt/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(
    page.getByText('Uma boa ofensiva começa antes da batalha.'),
  ).toBeVisible();
});

test('seletor traduz o slug e preserva a query string', async ({ page }) => {
  const query =
    '?ally=kabilla-light-430&allyLeader=19&enemy=triton-wind-847&enemyLeader=24';
  await page.goto(`/speed-comparison/${query}`);

  const portuguese = page.locator('.language-options a[lang="pt-BR"]');
  await expect(portuguese).toHaveAttribute(
    'href',
    `/pt/comparador-spd/${query}`,
  );

  await page.goto((await portuguese.getAttribute('href'))!);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page).toHaveURL(
    new RegExp('/pt/comparador-spd/\\?ally=kabilla'),
  );
  await expect(page.locator('.language-options a[lang="en"]')).toHaveAttribute(
    'href',
    `/speed-comparison/${query}`,
  );
});

test('seletor traduz a rota de detalhe sem traduzir dados oficiais', async ({
  page,
}) => {
  await page.goto('/monsters/carcano/');
  await expect(
    page.locator('.language-options a[lang="pt-BR"]'),
  ).toHaveAttribute('href', '/pt/monstros/carcano/');

  await page.goto('/pt/monstros/carcano/');
  await expect(page.getByRole('heading', { name: 'Como obter' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Accurate Fire' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Attacks the enemy to inflict damage that ignores all beneficial effects that reduce damage taken.',
    ),
  ).toBeVisible();
});

test('URLs portuguesas antigas redirecionam e o sitemap lista alternates', async ({
  page,
  request,
}) => {
  await page.goto('/comparador-spd/?ally=kabilla-light-430');
  await expect(page).toHaveURL(
    /\/pt\/comparador-spd\/\?ally=kabilla-light-430$/,
  );

  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const sitemap = await response.text();
  expect(sitemap).toContain(
    '<loc>https://sw-help.rafabcarrenho.workers.dev/speed-comparison/</loc>',
  );
  expect(sitemap).toContain(
    'hreflang="pt-BR" href="https://sw-help.rafabcarrenho.workers.dev/pt/comparador-spd/"',
  );
});
