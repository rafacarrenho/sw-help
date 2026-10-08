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
  expect(xml).toContain(`<loc>${productionOrigin}/es</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/fr</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/de</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/about</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt/sobre</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/contact</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt/contato</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/privacy</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt/privacidade</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/terms</loc>`);
  expect(xml).toContain(`<loc>${productionOrigin}/pt/termos</loc>`);
  expect(xml).toContain(
    `<loc>${productionOrigin}/fr/conditions-utilisation</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/de/nutzungsbedingungen</loc>`,
  );
  expect(xml).toContain(`<loc>${productionOrigin}/summoners-war</loc>`);
  expect(xml).toContain(
    `<loc>${productionOrigin}/summoners-war/siege-counter</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/pt/summoners-war/siege-counter</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/fr/summoners-war/comparateur-spd</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/de/summoners-war/spd-vergleich</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/summoners-war/monsters/page/2</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/pt/summoners-war/monstros/pagina/2</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/es/summoners-war/monstruos/pagina/2</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/fr/summoners-war/monstres/page/2</loc>`,
  );
  expect(xml).toContain(
    `<loc>${productionOrigin}/de/summoners-war/monster/seite/2</loc>`,
  );
  expect(xml).toMatch(
    new RegExp(
      `<loc>${productionOrigin}/summoners-war/siege-counter/[^/]+</loc>`,
    ),
  );
  expect(xml).not.toContain(`<loc>${productionOrigin}/siege/`);
  expect(xml).not.toContain(`<loc>${productionOrigin}/fr/conditions</loc>`);
  expect(xml).not.toContain(`<loc>${productionOrigin}/de/bedingungen</loc>`);
  expect(xml).not.toContain(
    `<loc>${productionOrigin}/fr/summoners-war/comparateur-vit</loc>`,
  );
  expect(xml).not.toContain(
    `<loc>${productionOrigin}/de/summoners-war/ges-vergleich</loc>`,
  );
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
    `hreflang="es" href="${productionOrigin}/es/summoners-war/monstruos"`,
  );
  expect(xml).toContain(
    `hreflang="fr" href="${productionOrigin}/fr/summoners-war/monstres"`,
  );
  expect(xml).toContain(
    `hreflang="de" href="${productionOrigin}/de/summoners-war/monster"`,
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

test('404 preserva espanhol, francês e alemão', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  const localizedPages = [
    {
      path: '/es/pagina-inexistente',
      locale: 'es',
      title: 'Página no encontrada · PlayerDojo',
      home: '/es',
    },
    {
      path: '/fr/page-inexistante',
      locale: 'fr',
      title: 'Page introuvable · PlayerDojo',
      home: '/fr',
    },
    {
      path: '/de/unbekannte-seite',
      locale: 'de',
      title: 'Seite nicht gefunden · PlayerDojo',
      home: '/de',
    },
  ];

  for (const entry of localizedPages) {
    const response = await page.goto(entry.path);
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('html')).toHaveAttribute('lang', entry.locale);
    await expect(page.locator('.not-found-actions a').first()).toHaveAttribute(
      'href',
      entry.home,
    );
  }
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
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/es/summoners-war/monstruos`,
  );
  await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/fr/summoners-war/monstres`,
  );
  await expect(page.locator('link[hreflang="de"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/de/summoners-war/monster`,
  );
});

test('páginas institucionais são localizadas, canônicas e não identificam o mantenedor', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  const pages = [
    {
      path: '/about',
      heading: 'Tools built to help players decide with confidence.',
      canonical: `${productionOrigin}/about`,
      alternate: `${productionOrigin}/pt/sobre`,
    },
    {
      path: '/contact',
      heading: 'Questions, corrections, and useful feedback are welcome.',
      canonical: `${productionOrigin}/contact`,
      alternate: `${productionOrigin}/pt/contato`,
    },
    {
      path: '/privacy',
      heading: 'Clear choices and limited data collection.',
      canonical: `${productionOrigin}/privacy`,
      alternate: `${productionOrigin}/pt/privacidade`,
    },
    {
      path: '/terms',
      heading: 'Use PlayerDojo as a planning aid.',
      canonical: `${productionOrigin}/terms`,
      alternate: `${productionOrigin}/pt/termos`,
    },
  ];

  for (const entry of pages) {
    await page.goto(entry.path);
    await expect(
      page.getByRole('heading', { name: entry.heading }),
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      entry.canonical,
    );
    await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute(
      'href',
      entry.alternate,
    );
    await expect(page.locator('body')).not.toContainText('Rafael Carrenho');
  }

  await page.goto('/pt/privacidade');
  await expect(
    page.getByRole('heading', {
      name: 'Escolhas claras e coleta limitada de dados.',
    }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    `${productionOrigin}/privacy`,
  );
});

test('metadados sociais e ícones publicam os assets PlayerDojo', async ({
  page,
  request,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    `${productionOrigin}/images/social/playerdojo-social.png`,
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    'content',
    '1200',
  );
  await expect(
    page.locator('meta[property="og:image:height"]'),
  ).toHaveAttribute('content', '630');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    `${productionOrigin}/images/social/playerdojo-social.png`,
  );
  await expect(page.locator('link[rel="icon"][sizes="48x48"]')).toHaveAttribute(
    'href',
    '/favicon-48.png',
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/apple-touch-icon.png',
  );

  for (const asset of [
    '/images/social/playerdojo-social.png',
    '/favicon-48.png',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
  ]) {
    expect((await request.get(asset)).status()).toBe(200);
  }
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
  test.setTimeout(120_000);

  const localizedToolPaths = [
    '/summoners-war/siege-counter',
    '/summoners-war/monsters',
    '/summoners-war/speed-tuning',
    '/summoners-war/speed-comparison',
    '/summoners-war/speed-tick',
    '/pt/summoners-war/siege-counter',
    '/pt/summoners-war/monstros',
    '/pt/summoners-war/spd-tuning',
    '/pt/summoners-war/comparador-spd',
    '/pt/summoners-war/spd-tick',
    '/es/summoners-war/siege-counter',
    '/es/summoners-war/monstruos',
    '/es/summoners-war/spd-tuning',
    '/es/summoners-war/comparador-spd',
    '/es/summoners-war/spd-tick',
    '/fr/summoners-war/siege-counter',
    '/fr/summoners-war/monstres',
    '/fr/summoners-war/spd-tuning',
    '/fr/summoners-war/comparateur-spd',
    '/fr/summoners-war/spd-tick',
    '/de/summoners-war/siege-counter',
    '/de/summoners-war/monster',
    '/de/summoners-war/spd-tuning',
    '/de/summoners-war/spd-vergleich',
    '/de/summoners-war/spd-tick',
  ];

  for (const path of localizedToolPaths) {
    await page.goto(path);
    const faqs = page.locator('.seo-faq-item');
    await expect(faqs).toHaveCount(10);
    await expect(faqs.first().getByRole('heading')).not.toBeEmpty();
    await expect(faqs.first().locator('p')).not.toBeEmpty();
    await expect(faqs.first()).toBeVisible();
  }
});

test('dados estruturados identificam o site e os breadcrumbs localizados', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/');
  const websiteData = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const homeStructuredData = JSON.parse(websiteData ?? '[]');
  expect(homeStructuredData).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        '@type': 'WebSite',
        name: 'PlayerDojo',
        url: `${productionOrigin}/`,
        inLanguage: 'en',
      }),
      expect.objectContaining({
        '@type': 'Organization',
        name: 'PlayerDojo',
        url: `${productionOrigin}/`,
        logo: `${productionOrigin}/icon-512.png`,
      }),
    ]),
  );
  expect(homeStructuredData[0]).toMatchObject({
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
