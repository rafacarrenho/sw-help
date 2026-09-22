import { test, expect } from '@playwright/test';

test('menu, filtros combinados e retorno da ficha preservam a busca', async ({
  page,
}) => {
  await page.goto('/');
  const mobileMenu = page.getByRole('button', { name: 'Abrir menu' });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await page.getByRole('link', { name: 'Catálogo de Monstros' }).click();
  await expect(
    page.getByRole('heading', { name: 'Catálogo de Monstros' }),
  ).toBeVisible();
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await page.getByRole('searchbox').fill('tótemist');
  await page.getByRole('combobox', { name: 'Elemento' }).selectOption('fire');
  await page
    .getByRole('combobox', { name: 'Estrelas naturais' })
    .selectOption('5');
  await expect(page.locator('[data-monster-card]')).toHaveCount(1);
  await expect(page.locator('[data-monster-card]')).toContainText('Nora');
  await page.locator('[data-monster-card]').click();
  await expect(
    page.getByRole('heading', { name: 'Nora', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Habilidade de líder' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Habilidades', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('HP máximo')).toBeVisible();
  await page.getByRole('link', { name: 'Todos os monstros' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('tótemist');
  await expect(page.locator('[data-monster-card]')).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Elemento' })).toHaveValue(
    'fire',
  );
});

test('paginação, histórico, líder e estado vazio', async ({ page }) => {
  await page.goto('/monstros/');
  const firstName = await page
    .locator('[data-monster-card]')
    .first()
    .textContent();
  await page.getByRole('link', { name: 'Próxima' }).click();
  await expect(page).toHaveURL(/\/pagina\/2\//);
  await expect(page.locator('[data-monster-card]').first()).not.toHaveText(
    firstName!,
  );
  await page.goBack();
  await expect(page.locator('[data-monster-card]').first()).toHaveText(
    firstName!,
  );
  await page
    .getByRole('combobox', { name: 'Habilidade de líder', exact: true })
    .selectOption('Attack Speed');
  const leader = page
    .locator('[data-monster-card]')
    .first()
    .locator('[data-leader]');
  await expect(leader.locator('[data-catalog-leader-icon]')).toHaveAttribute(
    'src',
    '/leader-skills/attack-speed.png',
  );
  await expect(leader.locator('[data-catalog-leader-primary]')).toContainText(
    'SPD +',
  );
  await expect(leader.locator('[data-catalog-leader-context]')).not.toBeEmpty();
  await page.getByRole('searchbox').fill('naoexiste123456');
  await expect(
    page.getByRole('heading', { name: 'Nenhum monstro encontrado' }),
  ).toBeVisible();
  await page
    .locator('[data-monster-empty]')
    .getByRole('button', { name: 'Limpar filtros' })
    .click();
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await expect(page.getByRole('searchbox')).toBeFocused();
});

test('filtra pelo conteúdo da habilidade de líder e preserva a seleção', async ({
  page,
}) => {
  await page.goto('/monstros/');
  expect(
    await page
      .locator('.bestiary-selects select')
      .evaluateAll((selects) =>
        selects.map((select) => select.getAttribute('name')),
      ),
  ).toEqual(['element', 'stars', 'leader', 'leaderScope', 'sort']);

  const scope = page.getByRole('combobox', {
    name: 'Conteúdo da habilidade de líder',
  });
  await scope.selectOption('global-arena');
  await expect(page).toHaveURL(/leaderScope=global-arena/);
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await expect
    .poll(async () =>
      page
        .locator('[data-catalog-leader-context]')
        .allTextContents()
        .then((contexts) =>
          contexts.every((context) =>
            ['Todos os conteúdos', 'Arena'].includes(context.trim()),
          ),
        ),
    )
    .toBe(true);

  await page.locator('[data-monster-card]').first().click();
  await page.getByRole('link', { name: 'Todos os monstros' }).click();
  await expect(scope).toHaveValue('global-arena');
  await page.reload();
  await expect(scope).toHaveValue('global-arena');
});

test('ordena por HP, ATQ e DEF e preserva a escolha na URL', async ({
  page,
}) => {
  await page.goto('/monstros/');
  const sort = page.getByRole('combobox', { name: 'Ordenar por' });
  for (const attribute of ['hp', 'attack', 'defense']) {
    await sort.selectOption(attribute);
    await expect(page).toHaveURL(new RegExp(`sort=${attribute}`));
    const values = await page
      .locator('[data-monster-card]')
      .evaluateAll((cards, key) => {
        const index = (
          window as Window & {
            __MONSTER_INDEX__?: Array<{
              id: string;
              sortStats?: Record<string, number>;
            }>;
          }
        ).__MONSTER_INDEX__;
        const byId = new Map(index?.map((monster) => [monster.id, monster]));
        return cards.map((card) => {
          const id = card.getAttribute('href')?.split('/').filter(Boolean)[1];
          return id ? (byId.get(id)?.sortStats?.[String(key)] ?? 0) : 0;
        });
      }, attribute);
    expect(values.length).toBe(48);
    expect(
      values.every((value, index) => index === 0 || values[index - 1] >= value),
    ).toBe(true);
  }
  await page.reload();
  await expect(sort).toHaveValue('defense');
});

test('todos os registros paginam com URL válida e busca se recupera de falha', async ({
  page,
}) => {
  await page.goto('/monstros/');
  await page.route('**/monstros/index.json', (route) => route.abort());
  await page.evaluate(() => {
    delete (window as Window & { __MONSTER_INDEX__?: unknown })
      .__MONSTER_INDEX__;
  });
  await page.getByRole('searchbox').fill('nora');
  await expect(page.locator('[data-monster-error]')).toBeVisible();
  await page.unroute('**/monstros/index.json');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.locator('[data-monster-card]').first()).toContainText(
    'Nora',
  );
  await page.goto('/monstros/?page=20');
  await expect(page.locator('[data-page-label]')).toHaveText('Página 20 de 24');
  await page.getByRole('link', { name: 'Próxima' }).click();
  await expect(page).toHaveURL(/\/pagina\/21\//);
  const response = await page.reload();
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-page-label]')).toHaveText('Página 21 de 24');
});

test('fichas e paginação estática funcionam sem JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/monstros/`);
  await expect(page.locator('[data-monster-card]')).toHaveCount(48);
  await page.getByRole('link', { name: 'Próxima' }).click();
  await expect(page).toHaveURL(/\/pagina\/2\//);
  await page.locator('[data-monster-card]').first().click();
  await expect(
    page.getByRole('heading', { name: 'Habilidade de líder' }),
  ).toBeVisible();
  await context.close();
});

test('Siege referencia o catálogo e layout permanece legível', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/siege/morris-eshir-orion/');
  await page.getByRole('link', { name: 'Ver Morris no catálogo' }).click();
  await expect(page).toHaveURL(/\/monstros\/morris-wind-1020\//);
  await expect(page.locator('.monster-profile img').first()).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Na mesma família' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.goto('/monstros/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test('ficha exibe atributos, habilidades originais e formas de obtenção', async ({
  page,
}) => {
  await page.goto('/monstros/carcano/');
  await expect(page.getByText('9.225')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Accurate Fire' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Attacks the enemy to inflict damage that ignores all beneficial effects that reduce damage taken.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Como obter' })).toBeVisible();
  await expect(page.getByText('Fire Scroll', { exact: true })).toBeVisible();
  await expect(page.locator('[data-leader-icon]')).toHaveAttribute(
    'src',
    '/leader-skills/attack-speed.png',
  );
  const progress = page.locator('.monster-skill-progress').first();
  await expect(progress.getByText('Progressão das melhorias')).toBeVisible();
  await progress.locator('summary').click();
  await expect(progress).toHaveAttribute('open', '');
  await expect(progress.locator('li').first()).toBeVisible();
  const columns = await page
    .locator('.monster-skill-list')
    .evaluate((list) =>
      getComputedStyle(list).gridTemplateColumns.split(' ').filter(Boolean),
    );
  expect(columns).toHaveLength(
    (page.viewportSize()?.width ?? 0) >= 900 ? 2 : 1,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
