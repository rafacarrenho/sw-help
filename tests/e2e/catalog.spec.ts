import { test, expect } from '@playwright/test';
import { seedEssentialPrivacyPreferences } from './helpers/privacy';

test.beforeEach(async ({ page }) => {
  await seedEssentialPrivacyPreferences(page);
});

test('busca combinada, URL, detalhe e retorno preservam a seleção', async ({
  page,
}) => {
  await page.goto('/pt/summoners-war/siege-counter');
  await expect(
    page.getByText('Counters cadastrados', { exact: true }),
  ).toBeVisible();
  const mobileMenu = page.getByRole('button', { name: 'Abrir menu' });
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(53);
  await expect(page.getByRole('link', { name: 'Spd Tuning' })).toHaveAttribute(
    'href',
    '/pt/summoners-war/spd-tuning',
  );
  await expect(page.getByRole('link', { name: 'Spd Tick' })).toHaveAttribute(
    'href',
    '/pt/summoners-war/spd-tick',
  );
  const mobileClose = page.locator('[data-mobile-menu-close]');
  if (await mobileClose.isVisible()) await mobileClose.click();
  await page.getByRole('searchbox').fill('MORRIS, trevor');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await page.getByLabel('Torre 4★', { exact: true }).check();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await expect(page).toHaveURL(/tower=4star/);
  await page.getByRole('link', { name: /Morris.*Trevor.*Figaro/ }).click();
  await expect(page.locator('.counter-card')).toHaveCount(4);
  await page.getByRole('link', { name: 'Todas as defesas' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('MORRIS, trevor');
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel('Torre 4★', { exact: true })).toBeChecked();
});
test('estado vazio permite limpar busca e filtro', async ({ page }) => {
  await page.goto('/pt/summoners-war/siege-counter?q=inexistente&tower=4star');
  await expect(
    page.getByRole('heading', { name: 'Nenhuma defesa encontrada' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await expect(page.locator('[data-defense-card]:visible')).toHaveCount(53);
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(page).toHaveURL(
    'http://127.0.0.1:4321/pt/summoners-war/siege-counter',
  );
});

test('counter específico mostra estratégia e ordem de eliminação da defesa', async ({
  page,
}) => {
  const shihwaCounters = [
    'platy-shihwa-iona',
    'platy-shihwa-betta',
    'betta-shihwa-iona',
  ];
  const matchupCases = [
    {
      defenseId: 'morris-trevor-figaro',
      instruction:
        'Mantenha Trevor controlado com o sleep de Shihwa enquanto foca Morris.',
      killOrder: ['morris-wind-1020', 'figaro-light-663', 'trevor-fire-894'],
    },
    {
      defenseId: 'morris-orion-trevor',
      instruction:
        'Mantenha Trevor controlado com o sleep de Shihwa. Elimine Orion primeiro, depois Morris',
      killOrder: ['orion-water-589', 'morris-wind-1020', 'trevor-fire-894'],
    },
    {
      defenseId: 'solveig-vigor-cichlid',
      instruction:
        'Mantenha Vigor controlado com o sleep de Shihwa. Elimine Cichlid primeiro, depois Vigor',
      killOrder: ['cichlid-wind-837', 'vigor', 'solveig-fire-2193'],
    },
    {
      defenseId: 'solveig-cichlid-molly',
      instruction:
        'Mantenha Cichlid sob controle com o sleep de Shihwa. Elimine Solveig primeiro, depois Cichlid',
      killOrder: ['solveig-fire-2193', 'cichlid-wind-837', 'molly-light-838'],
    },
    {
      defenseId: 'solveig-iris-hraesvelg',
      instruction:
        'Mantenha Iris sob controle com o sleep de Shihwa. Elimine Hraesvelg primeiro, depois Iris',
      killOrder: ['hraesvelg-wind-520', 'iris-light-858', 'solveig-fire-2193'],
    },
  ];

  for (const matchup of matchupCases) {
    await page.goto(`/pt/summoners-war/siege-counter/${matchup.defenseId}`);

    for (const counterId of shihwaCounters) {
      const counter = page.locator(
        `.counter-card[data-counter-id="${counterId}"]`,
      );
      await expect(counter).toHaveCount(1);
      await expect(counter.locator('.counter-instruction p')).toContainText(
        matchup.instruction,
      );
      await expect(
        counter.getByRole('heading', { name: 'Ordem de eliminação' }),
      ).toBeVisible();
      await expect(counter.locator('[data-kill-order-monster]')).toHaveCount(3);
      expect(
        await counter
          .locator('[data-kill-order-monster]')
          .evaluateAll((targets) =>
            targets.map((target) =>
              target.getAttribute('data-kill-order-monster'),
            ),
          ),
      ).toEqual(matchup.killOrder);
      expect(
        await counter
          .locator('.counter-kill-order-sequence')
          .evaluate((sequence) => sequence.scrollWidth <= sequence.clientWidth),
      ).toBeTruthy();
    }
  }

  await page.goto('/pt/summoners-war/siege-counter/morris-eshir-orion');
  await expect(page.locator('.counter-kill-order')).toHaveCount(0);

  const inheritedBuild = page
    .locator('.counter-card[data-counter-id="platy-shihwa-iona"]')
    .getByRole('table');
  await expect(inheritedBuild).toContainText('Violent');
  await expect(inheritedBuild).toContainText('Destroy');
});

test('detalhes, recursos locais e layout funcionam sem erros', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/pt/summoners-war/siege-counter/morris-eshir-orion');
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
  await expect(
    firstCounter.getByRole('heading', { name: 'Como jogar' }),
  ).toBeVisible();
  await expect(
    firstCounter.getByRole('heading', { name: 'Configuração sugerida' }),
  ).toBeVisible();
  await expect(firstCounter.getByText('Plano de batalha')).toHaveCount(0);
  const configuration = firstCounter.getByRole('table', {
    name: 'Configuração da ofensiva 1',
  });
  await expect(configuration).toBeVisible();
  for (const column of ['Status', 'Loren', 'Elucia', 'Mimirr']) {
    await expect(
      configuration.getByRole('columnheader', { name: column, exact: true }),
    ).toBeAttached();
  }
  for (const row of [
    'Seq.',
    'Runa',
    'HP',
    'ATK',
    'DEF',
    'SPD',
    'CR',
    'CD',
    'RES',
    'ACC',
  ]) {
    await expect(
      configuration.getByRole('rowheader', { name: row, exact: true }),
    ).toBeAttached();
  }
  await expect(configuration.locator('tbody tr')).toHaveCount(10);
  await expect(
    configuration.getByRole('rowheader', { name: 'Seq.', exact: true }),
  ).toHaveCSS('text-align', 'left');
  await expect(configuration.locator('tbody td').first()).toHaveCSS(
    'text-align',
    'left',
  );
  await expect(configuration.locator('tbody td').last()).toHaveCSS(
    'text-align',
    'left',
  );
  await expect(
    configuration.getByRole('columnheader', { name: 'Tick', exact: true }),
  ).toHaveCount(0);
  await expect(configuration.locator('tbody tr').nth(5)).toContainText(
    'Tick 5+144',
  );
  const allConfigurationsFit = () =>
    page
      .locator('.counter-table-wrap')
      .evaluateAll((elements) =>
        elements.every((element) => element.scrollWidth <= element.clientWidth),
      );
  expect(await allConfigurationsFit()).toBeTruthy();
  await expect(firstCounter.locator('.counter-scroll-hint')).toHaveCount(0);
  if (page.viewportSize()!.width > 760) {
    await page.getByRole('button', { name: 'Recolher menu lateral' }).click();
    await expect(page.locator('html')).toHaveClass(/nav-collapsed/);
    expect(await allConfigurationsFit()).toBeTruthy();
  }
  const secondCounter = page.locator('.counter-card').nth(1);
  const secondConfiguration = secondCounter.getByRole('table', {
    name: 'Configuração da ofensiva 2',
  });
  for (const [index, monster] of ['Platy', 'Shihwa', 'Iona'].entries()) {
    await expect(
      secondConfiguration.getByRole('columnheader').nth(index + 1),
    ).toHaveText(monster);
  }
  const secondRows = secondConfiguration.locator('tbody tr');
  await expect(secondRows.nth(2).locator('td').nth(0)).toHaveText('+30k');
  await expect(secondRows.nth(2).locator('td').nth(1)).toHaveText('+20k');
  await expect(secondRows.nth(3).locator('td').nth(1)).toHaveText('+1k');
  await expect(secondRows.nth(4).locator('td').nth(0)).toHaveText('+700');
  await expect(secondRows.nth(5).locator('td').nth(0)).toContainText(
    'Tick 5+149',
  );
  await expect(secondRows.nth(5).locator('td').nth(1)).toContainText(
    'Tick 5+144',
  );
  await expect(secondRows.nth(8).locator('td').nth(0)).toHaveText('100%');
  await expect(
    secondRows.nth(9).locator('td').nth(0).getByText('Desejável'),
  ).toBeAttached();
  await expect(
    secondRows.nth(9).locator('td').nth(1).getByText('Desejável'),
  ).toBeAttached();
  if (page.viewportSize()!.width <= 460) {
    expect(await allConfigurationsFit()).toBeTruthy();
  }
  await expect(firstCounter.locator('[data-team-leader-icon]')).toHaveCount(1);
  await expect(firstCounter.locator('[data-team-leader-icon]')).toHaveAttribute(
    'alt',
    'Líder da composição',
  );
  await expect(
    page.getByText('As sugestões não garantem vitória.', { exact: false }),
  ).toBeVisible();
  await expect(firstCounter.getByText('EXEMPLO', { exact: true })).toHaveCount(
    0,
  );
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
  await page.goto('/pt/summoners-war/siege-counter');
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
  await page.goto(`${baseURL}/pt/summoners-war/siege-counter`);
  await expect(page.locator('[data-defense-card]')).toHaveCount(53);
  await page.getByRole('link', { name: /Morris.*Eshir.*Orion/ }).click();
  await expect(page.locator('.counter-card')).toHaveCount(4);
  await context.close();
});
