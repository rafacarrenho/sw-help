import { test, expect } from '@playwright/test';

const productionOrigin = 'https://sw-help.rafabcarrenho.workers.dev';

test('sitemap lista somente URLs canônicas com alternativas de idioma', async ({
  request,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('xml');

  const xml = await response.text();
  expect(xml).toContain(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  );
  expect(xml).toContain(`<loc>${productionOrigin}/</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/siege-counter</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt/siege-counter</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/monsters/page/2</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt/monstros/pagina/2</loc>`);
  expect(xml).toMatch(
    new RegExp(`<loc>${productionOrigin}/siege-counter/[^/]+</loc>`),
  );
  expect(xml).not.toContain(`<loc>${productionOrigin}/siege/`);
  expect(xml).toMatch(
    new RegExp(`<loc>${productionOrigin}/pt/monstros/[^/]+</loc>`),
  );
  expect(xml).toContain(`hreflang="en" href="${productionOrigin}/monsters"`);
  expect(xml).toContain(
    `hreflang="pt-BR" href="${productionOrigin}/pt/monstros"`,
  );
  expect(xml).toContain(
    `hreflang="x-default" href="${productionOrigin}/monsters"`,
  );

  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, location]) => location,
  );
  expect(locations.length).toBeGreaterThan(0);
  expect(new Set(locations).size).toBe(locations.length);
  expect(
    locations.every((location) => {
      const pathname = new URL(location).pathname;
      return pathname === '/' || !pathname.endsWith('/');
    }),
  ).toBe(true);
  expect(locations.some((location) => location.includes('?'))).toBe(false);
  expect(locations).not.toContain(`${productionOrigin}/404`);
  expect(locations).not.toContain(`${productionOrigin}/spd-tuning`);
  expect(locations).not.toContain(`${productionOrigin}/spd-tick`);
  expect(xml).not.toContain('/monstros/index.json');
});

test('404 em inglês retorna status correto e não publica canonical', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  const response = await page.goto('/sitemfdf');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found · SW Help');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Back to home' }),
  ).toHaveAttribute('href', '/');
  await expect(
    page.getByRole('link', { name: 'Explore monsters' }),
  ).toHaveAttribute('href', '/monsters');
  await expect(
    page.getByLabel('Breadcrumb').getByRole('link', { name: 'Home' }),
  ).toHaveAttribute('href', '/');
});

test('404 em português preserva idioma e links localizados', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  const response = await page.goto('/pt/pagina-inexistente');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Página não encontrada · SW Help');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Voltar ao início' }),
  ).toHaveAttribute('href', '/pt');
  await expect(
    page.getByRole('link', { name: 'Explorar monstros' }),
  ).toHaveAttribute('href', '/pt/monstros');
  await expect(
    page.getByLabel('Breadcrumb').getByRole('link', { name: 'Início' }),
  ).toHaveAttribute('href', '/pt');
});

test('página normal preserva canonical e alternativas de idioma', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/monsters');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/monsters`,
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/monsters`,
  );
  await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/pt/monstros`,
  );
});
