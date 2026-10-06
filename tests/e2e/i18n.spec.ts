import { test, expect } from '@playwright/test';
import { seedEssentialPrivacyPreferences } from './helpers/privacy';

test.beforeEach(async ({ page }) => {
  await seedEssentialPrivacyPreferences(page);
});

test('inglês ocupa a raiz e português fica sob /pt', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(
    page.getByRole('heading', { name: 'One portal. Every game plan.' }),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.playerdojo.com/',
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://www.playerdojo.com/',
  );
  await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute(
    'href',
    'https://www.playerdojo.com/pt',
  );
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    'https://www.playerdojo.com/es',
  );
  await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute(
    'href',
    'https://www.playerdojo.com/fr',
  );
  await expect(page.locator('link[hreflang="de"]')).toHaveAttribute(
    'href',
    'https://www.playerdojo.com/de',
  );

  await page.goto('/pt');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(
    page.getByRole('heading', { name: 'Um portal. Todos os seus planos.' }),
  ).toBeVisible();
});

test('home apresenta as ferramentas e a navegação usa a nova hierarquia', async ({
  page,
}, testInfo) => {
  await page.goto('/pt');
  await expect(page.locator('.game-card')).toHaveAttribute(
    'href',
    '/pt/summoners-war',
  );
  await expect(page.locator('.breadcrumb')).toHaveText('Início');
  await expect(page.locator('.sidebar .brand')).toHaveAttribute('href', '/pt');
  await expect(page.locator('.sidebar .brand')).toHaveAttribute(
    'aria-label',
    'PlayerDojo, início do portal',
  );
  await expect(page.locator('.sidebar .brand')).toContainText('PlayerDojo');
  await expect(page.locator('.site-footer-logo')).toContainText('PlayerDojo');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
  }
  const gameSelector = page.locator('.sidebar [data-game-toggle]');
  await expect(gameSelector).toBeVisible();
  await expect(page.locator('.topbar [data-game-toggle]')).toHaveCount(0);
  await expect(gameSelector).toHaveAttribute('aria-expanded', 'false');
  await gameSelector.click();
  await expect(
    page.locator('[data-game-menu] [data-game-link]'),
  ).toHaveAttribute('href', '/pt/summoners-war');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Summoners War' }),
  ).toHaveAttribute('href', '/pt/summoners-war');
  await expect(
    page.locator('footer').getByRole('heading', { name: 'Explorar' }),
  ).toBeVisible();
  await expect(
    page.locator('footer').getByRole('heading', { name: 'Jogos' }),
  ).toBeVisible();
  await expect(
    page.locator('footer').getByRole('heading', { name: 'Informações' }),
  ).toBeVisible();
  await expect(
    page.locator('footer').getByRole('link', { name: 'Sobre', exact: true }),
  ).toHaveAttribute('href', '/pt/sobre');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Contato', exact: true }),
  ).toHaveAttribute('href', '/pt/contato');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Privacidade' }),
  ).toHaveAttribute('href', '/pt/privacidade');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Termos' }),
  ).toHaveAttribute('href', '/pt/termos');

  await page.goto('/pt/summoners-war');
  await expect(page.locator('[data-game-toggle]')).toHaveCount(0);
  await expect(page.locator('.game-tag')).toContainText('Summoners War');
  await expect(
    page.getByRole('heading', { name: 'Planeje melhor. Entre preparado.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Abrir Siege Counter' }),
  ).toHaveAttribute('href', '/pt/summoners-war/siege-counter');
  await expect(
    page.locator('.sidebar').locator('.nav-item[aria-label="Summoners War"]'),
  ).toHaveAttribute('href', '/pt/summoners-war');
  await expect(
    page.locator('.sidebar .nav-item[aria-label="Início do portal"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('.sidebar .nav-item[aria-label="Todos os jogos"]'),
  ).toHaveCount(0);
  await expect(
    page
      .locator('footer')
      .getByRole('link', { name: 'Início do portal', exact: true }),
  ).toHaveAttribute('href', '/pt');
  await expect(
    page.locator('footer').getByRole('link', { name: 'Todos os jogos' }),
  ).toHaveAttribute('href', '/pt#games');
  await expect(page.locator('.breadcrumb')).toContainText(
    'InícioSummoners War',
  );

  await page.goto('/pt/summoners-war/siege-counter');
  await expect(page.locator('.breadcrumb')).toContainText(
    'InícioSummoners WarSiege Counter',
  );
  await expect(page.locator('.breadcrumb a').first()).toHaveAttribute(
    'href',
    '/pt',
  );

  await page.goto('/pt/summoners-war/siege-counter/morris-eshir-orion');
  await expect(page.locator('.breadcrumb')).toContainText(
    'InícioSummoners WarSiege CounterDefesa',
  );
  await expect(page.locator('.breadcrumb a').nth(2)).toHaveAttribute(
    'href',
    '/pt/summoners-war/siege-counter',
  );
});

test('dropdown de idioma abre, fecha e oferece a alternativa pelo teclado', async ({
  page,
}, testInfo) => {
  await page.goto('/');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
  }

  const toggle = page.locator('[data-language-toggle]');
  const menu = page.locator('[data-language-menu]');
  const portuguese = menu.getByRole('menuitem', { name: /Português/ });
  const spanish = menu.getByRole('menuitem', { name: /Español/ });
  const french = menu.getByRole('menuitem', { name: /Français/ });
  const german = menu.getByRole('menuitem', { name: /Deutsch/ });

  await expect(toggle).toContainText('English');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await expect(portuguese).toHaveAttribute('href', '/pt');
  await expect(spanish).toHaveAttribute('href', '/es');
  await expect(french).toHaveAttribute('href', '/fr');
  await expect(german).toHaveAttribute('href', '/de');

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  await toggle.press('ArrowDown');
  await expect(menu).toBeVisible();
  await expect(portuguese).toBeFocused();
});

test('dropdown permanece utilizável com a sidebar recolhida', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/');
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();

  const toggle = page.locator('[data-language-toggle]');
  await expect(page.locator('.language-current')).toBeHidden();
  await toggle.click();

  await expect(page.locator('[data-language-menu]')).toBeVisible();
  await expect(page.locator('[data-nav-tooltip]')).not.toHaveClass(
    /is-visible/,
  );
});

test('seletor traduz o slug e preserva a query string', async ({ page }) => {
  const query =
    '?ally=kabilla-light-430&allyLeader=19&enemy=triton-wind-847&enemyLeader=24';
  await page.goto(`/summoners-war/speed-comparison${query}`);

  const portuguese = page.locator('.language-menu a[lang="pt-BR"]');
  await expect(portuguese).toHaveAttribute(
    'href',
    `/pt/summoners-war/comparador-spd${query}`,
  );
  await expect(page.locator('.language-menu a[lang="es"]')).toHaveAttribute(
    'href',
    `/es/summoners-war/comparador-spd${query}`,
  );
  await expect(page.locator('.language-menu a[lang="fr"]')).toHaveAttribute(
    'href',
    `/fr/summoners-war/comparateur-vit${query}`,
  );
  await expect(page.locator('.language-menu a[lang="de"]')).toHaveAttribute(
    'href',
    `/de/summoners-war/ges-vergleich${query}`,
  );

  await page.goto((await portuguese.getAttribute('href'))!);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page).toHaveURL(
    new RegExp('/pt/summoners-war/comparador-spd\\?ally=kabilla'),
  );
  await expect(page.locator('.language-menu a[lang="en"]')).toHaveAttribute(
    'href',
    `/summoners-war/speed-comparison${query}`,
  );
});

test('seletor traduz a rota de detalhe sem traduzir dados oficiais', async ({
  page,
}) => {
  await page.goto('/summoners-war/monsters/carcano');
  await expect(page.locator('.language-menu a[lang="pt-BR"]')).toHaveAttribute(
    'href',
    '/pt/summoners-war/monstros/carcano',
  );

  await page.goto('/pt/summoners-war/monstros/carcano');
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

test('espanhol, francês e alemão publicam ferramentas e detalhes localizados', async ({
  page,
}) => {
  const locales = [
    {
      locale: 'es',
      home: '/es/summoners-war',
      heading: 'Planifica mejor.',
      monster: '/es/summoners-war/monstruos/carcano',
      skills: 'Habilidades',
    },
    {
      locale: 'fr',
      home: '/fr/summoners-war',
      heading: 'Planifiez mieux.',
      monster: '/fr/summoners-war/monstres/carcano',
      skills: 'Compétences',
    },
    {
      locale: 'de',
      home: '/de/summoners-war',
      heading: 'Besser planen.',
      monster: '/de/summoners-war/monster/carcano',
      skills: 'Fähigkeiten',
    },
  ];

  for (const entry of locales) {
    await page.goto(entry.home);
    await expect(page.locator('html')).toHaveAttribute('lang', entry.locale);
    await expect(page.locator('h1')).toContainText(entry.heading);

    await page.goto(entry.monster);
    await expect(page.locator('html')).toHaveAttribute('lang', entry.locale);
    await expect(
      page.getByRole('heading', { name: entry.skills }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Accurate Fire' }),
    ).toHaveAttribute('lang', 'en');
    await expect(
      page.getByText(
        'Attacks the enemy to inflict damage that ignores all beneficial effects that reduce damage taken.',
      ),
    ).toHaveAttribute('lang', 'en');
  }
});

test('sitemap lista as rotas canônicas e seus alternates', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const sitemap = await response.text();
  expect(sitemap).toContain(
    '<loc>https://www.playerdojo.com/summoners-war/speed-comparison</loc>',
  );
  expect(sitemap).toContain(
    'hreflang="pt-BR" href="https://www.playerdojo.com/pt/summoners-war/comparador-spd"',
  );
});
