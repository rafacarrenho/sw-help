import { test, expect } from '@playwright/test';

const leaderPercentages = [0, 10, 15, 16, 17, 19, 20, 21, 23, 24, 28, 30, 33];

test('busca um monstro e compara a SPD para todas as lideranças', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/spd-tick/');

  await expect(
    page.getByRole('heading', { name: 'Calculadora por monstro' }),
  ).toBeVisible();
  await expect(page.locator('thead [data-leader-percent]')).toHaveCount(
    leaderPercentages.length,
  );
  await expect(
    page.locator('thead [data-leader-percent]').allTextContents(),
  ).resolves.toEqual(leaderPercentages.map((value) => `${value}%`));
  await expect(page.locator('#speed-tick-table-body tr')).toHaveCount(9);
  await expect(
    page.locator('#speed-tick-table-body tr.row-highlight'),
  ).toHaveCount(2);
  await expect(
    page.locator(
      '#speed-tick-table-body tr.row-highlight .speed-tick-sticky-column',
    ),
  ).toHaveText(['Tick 5 286 SPD', 'Tick 6 239 SPD']);
  await expect(
    page.locator('#speed-tick-table-body tr').filter({ hasText: 'Tick 4' }),
  ).not.toHaveClass(/row-highlight/);
  await expect(
    page.locator('#speed-tick-table-body tr').first().locator('td'),
  ).toHaveCount(leaderPercentages.length);

  const monsterSearch = page.getByRole('combobox', { name: 'Monstro' });
  const swiftToggle = page.getByRole('checkbox', { name: 'Usa Swift' });
  const monsterListbox = page.getByRole('listbox', {
    name: 'Monstros encontrados',
  });
  const catalog = await page.locator('#speed-tick-data').evaluate((node) => {
    const data = JSON.parse(node.textContent ?? '{"monsters":[]}') as {
      monsters: Array<{ id: string; name: string }>;
    };
    const sortedMonsters = [...data.monsters].sort((first, second) =>
      first.name.localeCompare(second.name, 'pt-BR', {
        sensitivity: 'base',
      }),
    );

    return {
      size: sortedMonsters.length,
      seventhId: sortedMonsters[6]?.id,
    };
  });
  await expect(monsterSearch).toHaveValue('');
  await expect(swiftToggle).not.toBeChecked();
  await expect(page.locator('#speed-tick-monster-name')).toHaveText(
    'Nenhum monstro selecionado',
  );
  await expect(page.locator('#speed-tick-selected-portrait')).toBeVisible();
  await expect(page.locator('#speed-tick-selected-portrait')).toHaveCSS(
    'width',
    '64px',
  );
  await expect(page.locator('#speed-tick-selected-placeholder')).toBeVisible();
  const initialSelectedSummaryHeight = await page
    .locator('.speed-tick-selected')
    .evaluate((element) => element.getBoundingClientRect().height);
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('100');
  await expect(
    page.locator(
      '#speed-tick-table-body tr:nth-child(3) [data-leader-percent="0"]',
    ),
  ).toHaveText('171 SPD');

  const isMobile = (page.viewportSize()?.width ?? 0) <= 820;
  expect(
    await page.locator('.speed-tick-form').evaluate((form) => {
      const columns = getComputedStyle(form).gridTemplateColumns.split(' ');
      return columns.filter(Boolean).length;
    }),
  ).toBe(isMobile ? 2 : 4);

  if (isMobile) {
    const positions = await page.evaluate(() => {
      const monster = document
        .querySelector('.speed-select--monster')!
        .getBoundingClientRect();
      const tower = document
        .querySelector('#speed-tick-bonus-percent')!
        .closest('.speed-select')!
        .getBoundingClientRect();
      const leader = document
        .querySelector('#speed-tick-leader')!
        .closest('.speed-select')!
        .getBoundingClientRect();
      const swift = document
        .querySelector('.speed-toggle--swift')!
        .getBoundingClientRect();

      return {
        monsterBottom: monster.bottom,
        monsterWidth: monster.width,
        towerTop: tower.top,
        towerBottom: tower.bottom,
        towerWidth: tower.width,
        leaderTop: leader.top,
        leaderWidth: leader.width,
        swiftTop: swift.top,
        swiftWidth: swift.width,
      };
    });

    expect(positions.monsterBottom).toBeLessThanOrEqual(positions.towerTop);
    expect(Math.abs(positions.towerTop - positions.leaderTop)).toBeLessThan(1);
    expect(Math.abs(positions.towerWidth - positions.leaderWidth)).toBeLessThan(
      1,
    );
    expect(positions.towerBottom).toBeLessThanOrEqual(positions.swiftTop);
    expect(
      Math.abs(positions.monsterWidth - positions.swiftWidth),
    ).toBeLessThan(1);
  }

  const leaderSelect = page.locator('#speed-tick-leader');
  await expect(leaderSelect).toHaveValue('all');
  await leaderSelect.selectOption('24');
  await expect(page.locator('thead [data-leader-percent]:visible')).toHaveText(
    '24%',
  );
  await expect(
    page.locator('#speed-tick-table-body tr').first().locator('td'),
  ).toHaveCount(1);

  const tickFiveSelectedLeader = page.locator(
    '#speed-tick-table-body tr:nth-child(3) [data-leader-percent="24"]',
  );
  const initialValue = await tickFiveSelectedLeader.textContent();
  await page.getByLabel('Torre SPD').selectOption('0');
  await expect(tickFiveSelectedLeader).not.toHaveText(initialValue ?? '');
  await expect(
    page.locator('#speed-tick-table-body tr.row-highlight'),
  ).toHaveCount(2);
  await expect(
    page.locator('#speed-tick-table-body tr').filter({ hasText: 'Tick 4' }),
  ).not.toHaveClass(/row-highlight/);

  await monsterSearch.focus();
  await expect(monsterListbox).toBeVisible();
  const initialMountedOptions = monsterListbox.getByRole('option');
  await expect(initialMountedOptions).toHaveCount(8);
  expect(catalog.size).toBeGreaterThan(1000);
  expect(await initialMountedOptions.count()).toBeLessThan(catalog.size);
  expect(
    await monsterListbox.evaluate(
      (listbox) => (listbox.clientHeight - 12) / 52,
    ),
  ).toBe(6);
  expect(
    await monsterListbox.evaluate(
      (listbox) => listbox.scrollHeight > listbox.clientHeight,
    ),
  ).toBeTruthy();

  for (let index = 0; index < 7; index += 1) {
    await monsterSearch.press('ArrowDown');
  }
  await expect(monsterSearch).toHaveAttribute(
    'aria-activedescendant',
    `speed-tick-monster-option-${catalog.seventhId}`,
  );
  expect(await monsterListbox.evaluate((listbox) => listbox.scrollTop)).toBe(
    52,
  );
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('100');

  await monsterListbox.evaluate((listbox) => {
    listbox.scrollTop = listbox.scrollHeight;
  });
  await expect(monsterListbox.getByRole('option').last()).toHaveAttribute(
    'aria-posinset',
    String(catalog.size),
  );

  await monsterSearch.fill('hacker');
  const awakenedHackerOption = page.locator(
    '#speed-tick-monster-option-51lv3r-light-2401',
  );
  await expect(awakenedHackerOption).toBeVisible();
  await expect(
    awakenedHackerOption.locator('.speed-monster-option-name'),
  ).toHaveText('51LV3R');
  await expect(
    awakenedHackerOption.locator('.speed-monster-option-unawakened'),
  ).toHaveText('Hacker');
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('100');

  await monsterSearch.fill('nóra');
  const noraOption = page.locator('#speed-tick-monster-option-nora');
  await expect(noraOption).toBeVisible();
  await expect(noraOption.locator('img')).toBeVisible();
  await noraOption.click();
  await expect(monsterSearch).toHaveValue('Nora');
  await expect(monsterSearch).not.toBeFocused();
  await expect(monsterListbox).toBeHidden();
  await expect(page.locator('#speed-tick-monster-name')).toHaveText('Nora');
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('99');
  await expect(page.locator('#speed-tick-selected-image')).toBeVisible();
  await expect(page.locator('#speed-tick-selected-placeholder')).toBeHidden();
  await expect(page.locator('#speed-tick-selected-portrait')).toHaveCSS(
    'width',
    '64px',
  );
  await expect
    .poll(() =>
      page
        .locator('.speed-tick-selected')
        .evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBe(initialSelectedSummaryHeight);
  await expect(leaderSelect).toHaveValue('24');

  await monsterSearch.fill('mo long');
  await expect(page.locator('#speed-tick-monster-name')).toHaveText(
    'Nenhum monstro selecionado',
  );
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('100');
  await monsterSearch.press('ArrowDown');
  await expect(monsterSearch).toHaveAttribute(
    'aria-activedescendant',
    'speed-tick-monster-option-mo-long',
  );
  await monsterSearch.press('Enter');
  await expect(monsterSearch).toHaveValue('Mo Long');
  await expect(monsterSearch).not.toBeFocused();
  await expect(monsterListbox).toBeHidden();
  await expect(page.locator('#speed-tick-monster-name')).toHaveText('Mo Long');
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('96');

  await monsterSearch.fill('monstro inexistente');
  await expect(
    page.getByText('Nenhum monstro encontrado', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('100');

  await monsterSearch.fill('');
  await expect(monsterListbox).toBeVisible();
  await expect(monsterListbox.getByRole('option')).toHaveCount(8);
  await expect(page.locator('#speed-tick-monster-name')).toHaveText(
    'Nenhum monstro selecionado',
  );
  await expect(page.locator('#speed-tick-selected-portrait')).toBeVisible();
  await expect(page.locator('#speed-tick-selected-placeholder')).toBeVisible();

  await leaderSelect.selectOption('all');
  await expect(page.locator('thead [data-leader-percent]:visible')).toHaveCount(
    leaderPercentages.length,
  );
  await expect(
    page.locator('#speed-tick-table-body tr').first().locator('td'),
  ).toHaveCount(leaderPercentages.length);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test('reposiciona a busca ao focar somente no mobile', async ({ page }) => {
  await page.goto('/spd-tick/');

  const monsterSearch = page.getByRole('combobox', { name: 'Monstro' });
  const monsterField = page.locator('.speed-select--monster');
  const initialScrollY = await page.evaluate(() => window.scrollY);
  const isMobile = (page.viewportSize()?.width ?? 0) <= 820;

  await monsterSearch.focus();

  if (isMobile) {
    const expectedTop = (page.viewportSize()?.width ?? 0) <= 760 ? 80 : 16;
    await expect
      .poll(() =>
        monsterField.evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeCloseTo(expectedTop, 0);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(
      initialScrollY,
    );
    return;
  }

  expect(await page.evaluate(() => window.scrollY)).toBe(initialScrollY);
});

test('replica os valores de Anne e aplica a correção Swift', async ({
  page,
}) => {
  await page.goto('/spd-tick/');

  const monsterSearch = page.getByRole('combobox', { name: 'Monstro' });
  await monsterSearch.fill('anne');
  await page.locator('#speed-tick-monster-option-anne-fire-181').click();
  await page.getByLabel('Torre SPD').selectOption('15');
  await page.getByLabel('Líder SPD').selectOption('0');
  await expect
    .poll(() =>
      page.evaluate(() =>
        Object.fromEntries(new URLSearchParams(window.location.search)),
      ),
    )
    .toEqual({ monster: 'anne-fire-181', leader: '0' });

  const visibleResults = page.locator(
    '#speed-tick-table-body [data-leader-percent="0"]',
  );
  await expect(page.locator('#speed-tick-monster-name')).toHaveText('Anne');
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('102');
  await expect(visibleResults).toHaveText([
    '359 SPD',
    '240 SPD',
    '168 SPD',
    '121 SPD',
    '87 SPD',
    '61 SPD',
    '41 SPD',
    '25 SPD',
    '12 SPD',
  ]);

  await page.getByRole('checkbox', { name: 'Usa Swift' }).check();
  await expect(page.locator('#speed-tick-monster-name')).toHaveText('Anne');
  await expect
    .poll(() =>
      page.evaluate(() =>
        Object.fromEntries(new URLSearchParams(window.location.search)),
      ),
    )
    .toEqual({ monster: 'anne-fire-181', leader: '0', swift: '1' });
  await expect(visibleResults).toHaveText([
    '360 SPD',
    '241 SPD',
    '169 SPD',
    '122 SPD',
    '88 SPD',
    '62 SPD',
    '42 SPD',
    '26 SPD',
    '13 SPD',
  ]);
});

test('restaura e normaliza resultados compartilhados pela URL', async ({
  page,
}) => {
  await page.goto(
    '/spd-tick/?utm_source=share&monster=anne-fire-181&tower=0&leader=24&swift=1#resultado',
  );

  const monsterSearch = page.getByRole('combobox', { name: 'Monstro' });
  const tickFive = page.locator(
    '#speed-tick-table-body tr:nth-child(3) [data-leader-percent="24"]',
  );
  await expect(monsterSearch).toHaveValue('Anne');
  await expect(page.locator('#speed-tick-monster-name')).toHaveText('Anne');
  await expect(page.getByLabel('Torre SPD')).toHaveValue('0');
  await expect(page.getByLabel('Líder SPD')).toHaveValue('24');
  await expect(page.getByRole('checkbox', { name: 'Usa Swift' })).toBeChecked();
  await expect(tickFive).toHaveText('160 SPD');
  await expect(page).toHaveURL(/utm_source=share/);
  await expect(page).toHaveURL(/#resultado$/);

  await page.getByRole('checkbox', { name: 'Usa Swift' }).uncheck();
  await expect
    .poll(() =>
      page.evaluate(() => new URLSearchParams(location.search).has('swift')),
    )
    .toBeFalsy();
  await expect(tickFive).toHaveText('159 SPD');

  await monsterSearch.fill('');
  await expect(page.locator('#speed-tick-base-speed')).toHaveText('100');
  await expect
    .poll(() =>
      page.evaluate(() => ({
        monster: new URLSearchParams(location.search).get('monster'),
        campaign: new URLSearchParams(location.search).get('utm_source'),
        hash: location.hash,
      })),
    )
    .toEqual({ monster: null, campaign: 'share', hash: '#resultado' });

  await page.goto(
    '/spd-tick/?monster=missing&tower=99&leader=999&swift=true&utm_source=share',
  );
  await expect(monsterSearch).toHaveValue('');
  await expect(page.getByLabel('Torre SPD')).toHaveValue('15');
  await expect(page.getByLabel('Líder SPD')).toHaveValue('all');
  await expect(
    page.getByRole('checkbox', { name: 'Usa Swift' }),
  ).not.toBeChecked();
  await expect
    .poll(() => page.evaluate(() => location.search))
    .toBe('?utm_source=share');

  await page.evaluate(() => {
    history.pushState(
      null,
      '',
      '/spd-tick/?monster=nora&tower=10&leader=0&swift=1',
    );
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(monsterSearch).toHaveValue('Nora');
  await expect(page.getByLabel('Torre SPD')).toHaveValue('10');
  await expect(page.getByLabel('Líder SPD')).toHaveValue('0');
  await expect(page.getByRole('checkbox', { name: 'Usa Swift' })).toBeChecked();
});

test('exibe fallback quando a foto do resultado não carrega', async ({
  page,
}) => {
  await page.route('**/monsters/*.png', (route) => route.abort());
  await page.goto('/spd-tick/');

  const monsterSearch = page.getByRole('combobox', { name: 'Monstro' });
  await monsterSearch.fill('nóra');
  const noraOption = page.locator('#speed-tick-monster-option-nora');
  await expect(noraOption.locator('.speed-monster-fallback')).toBeVisible();

  await noraOption.click();
  await expect(page.locator('#speed-tick-selected-fallback')).toBeVisible();
  await expect(page.locator('#speed-tick-monster-name')).toHaveText('Nora');
});

test('mantém o emblema SPD centralizado nos breakpoints móveis', async ({
  page,
}) => {
  for (const width of [461, 500, 600, 760]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/spd-tick/');

    const alignment = await page.locator('.intro-emblem').evaluate((emblem) => {
      const emblemRect = emblem.getBoundingClientRect();
      const iconRect = emblem
        .querySelector('.speed-tick-icon')!
        .getBoundingClientRect();

      return {
        horizontalCenterDifference: Math.abs(
          emblemRect.left +
            emblemRect.width / 2 -
            (iconRect.left + iconRect.width / 2),
        ),
        verticalCenterDifference: Math.abs(
          emblemRect.top +
            emblemRect.height / 2 -
            (iconRect.top + iconRect.height / 2),
        ),
        horizontalOverflow:
          document.documentElement.scrollWidth - window.innerWidth,
      };
    });

    expect(alignment.horizontalCenterDifference).toBeLessThan(0.5);
    expect(alignment.verticalCenterDifference).toBeLessThan(0.5);
    expect(alignment.horizontalOverflow).toBeLessThanOrEqual(0);
  }

  await page.setViewportSize({ width: 460, height: 800 });
  await expect(page.locator('.intro-emblem')).toBeHidden();
});
