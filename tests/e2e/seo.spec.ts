import { test, expect } from '@playwright/test';

const productionOrigin = 'https://www.playerdojo.com';

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
  expect(xml).toContain(`<loc>${productionOrigin}/summoners-war</loc>`);
  expect(xml).toContain(
    `<loc>${productionOrigin}/summoners-war/siege-counter</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/pt/summoners-war/siege-counter</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/summoners-war/monsters/page/2</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/pt/summoners-war/monstros/pagina/2</loc>`,
  );
  expect(xml).toMatch(
    new RegExp(
      `<loc>${productionOrigin}/summoners-war/siege-counter/[^/]+</loc>`,
    ),
  );
  expect(xml).not.toContain(`<loc>${productionOrigin}/siege/`);
  expect(xml).toMatch(
    new RegExp(
      `<loc>${productionOrigin}/pt/summoners-war/monstros/[^/]+</loc>`,
    ),
  );
  expect(xml).toContain(
    `hreflang="en" href="${productionOrigin}/summoners-war/monsters"`,
  );
  expect(xml).toContain(
    `hreflang="pt-BR" href="${productionOrigin}/pt/summoners-war/monstros"`,
  );
  expect(xml).toContain(
    `hreflang="x-default" href="${productionOrigin}/summoners-war/monsters"`,
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
  await expect(page).toHaveTitle('Page not found · PlayerDojo');
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
  ).toHaveAttribute('href', '/summoners-war/monsters');
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
  await expect(page).toHaveTitle('Página não encontrada · PlayerDojo');
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
  ).toHaveAttribute('href', '/pt/summoners-war/monstros');
  await expect(
    page.getByLabel('Breadcrumb').getByRole('link', { name: 'Início' }),
  ).toHaveAttribute('href', '/pt');
});

test('página normal preserva canonical e alternativas de idioma', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/summoners-war/monsters');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/summoners-war/monsters`,
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/summoners-war/monsters`,
  );
  await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/pt/summoners-war/monstros`,
  );
});

test('páginas principais usam títulos e descrições focados em Summoners War', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  const pages = [
    {
      path: '/',
      title: 'Free Tools and Calculators for Games · PlayerDojo',
    },
    {
      path: '/summoners-war',
      title: 'Summoners War Tools for Siege, SPD & Monsters · PlayerDojo',
    },
    {
      path: '/summoners-war/siege-counter',
      title: 'Summoners War Siege Counter & Offense Teams · PlayerDojo',
    },
    {
      path: '/summoners-war/monsters',
      title: 'Summoners War Monster Database & Catalog · PlayerDojo',
    },
    {
      path: '/summoners-war/speed-tuning',
      title: 'Summoners War SPD Tuning Calculator · PlayerDojo',
    },
    {
      path: '/summoners-war/speed-comparison',
      title: 'Summoners War SPD Comparison Calculator · PlayerDojo',
    },
    {
      path: '/summoners-war/speed-tick',
      title: 'Summoners War SPD Tick Calculator · PlayerDojo',
    },
  ];

  for (const entry of pages) {
    await page.goto(entry.path);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Summoners War/,
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'PlayerDojo',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    );
  }
});

test('cada ferramenta publica dez FAQs úteis e renderizadas no HTML', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  for (const path of [
    '/summoners-war/siege-counter',
    '/summoners-war/monsters',
    '/summoners-war/speed-tuning',
    '/summoners-war/speed-comparison',
    '/summoners-war/speed-tick',
  ]) {
    await page.goto(path);
    const faqs = page.locator('.seo-faq-item');
    await expect(faqs).toHaveCount(10);
    await expect(faqs.first().getByRole('heading')).not.toBeEmpty();
    await expect(faqs.first().locator('p')).not.toBeEmpty();
    await expect(faqs.first()).toBeVisible();
  }

  await page.goto('/pt/summoners-war/spd-tick');
  await expect(page.locator('.seo-faq-item')).toHaveCount(10);
  await expect(
    page.getByRole('heading', {
      name: 'Dúvidas sobre a calculadora de SPD Tick',
    }),
  ).toBeVisible();
});

test('dados estruturados identificam o site e os breadcrumbs localizados', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/');
  const websiteData = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(JSON.parse(websiteData ?? '{}')).toMatchObject({
    '@type': 'WebSite',
    name: 'PlayerDojo',
    url: `${productionOrigin}/`,
    inLanguage: 'en',
  });

  await page.goto('/pt/summoners-war/siege-counter/morris-eshir-orion');
  const breadcrumbData = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const parsed = JSON.parse(breadcrumbData ?? '{}');
  expect(parsed['@type']).toBe('BreadcrumbList');
  expect(parsed.itemListElement).toHaveLength(4);
  expect(parsed.itemListElement[0]).toMatchObject({
    position: 1,
    name: 'Início',
    item: `${productionOrigin}/pt`,
  });
  expect(parsed.itemListElement[1]).toMatchObject({
    position: 2,
    name: 'Summoners War',
    item: `${productionOrigin}/pt/summoners-war`,
  });
  expect(parsed.itemListElement[3].item).toBe(
    `${productionOrigin}/pt/summoners-war/siege-counter/morris-eshir-orion`,
  );
});

test('paginação e detalhes recebem metadados únicos', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/summoners-war/monsters/page/2');
  await expect(page).toHaveTitle(
    'Summoners War Monster Database & Catalog – Page 2 · PlayerDojo',
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /Page 2 of 24\.$/,
  );

  await page.goto('/summoners-war/monsters/clara');
  await expect(page).toHaveTitle(/Clara \(Fire\) – Summoners War Monster/);

  await page.goto('/summoners-war/siege-counter/morris-eshir-orion');
  await expect(page).toHaveTitle(
    /Morris · Eshir · Orion Siege Counters – Summoners War/,
  );
});
