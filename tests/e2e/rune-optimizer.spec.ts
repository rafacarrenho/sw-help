import { expect, test } from '@playwright/test';
import { seedEssentialPrivacyPreferences } from './helpers/privacy';

test.beforeEach(async ({ page }) => {
  await seedEssentialPrivacyPreferences(page);
});

const syntheticExport = {
  command: 'HubUserLogin',
  ret_code: 0,
  session_key: 'must-not-be-stored',
  wizard_info: { wizard_id: 999999, wizard_name: 'Private test account' },
  rune_lock_list: [{ rune_id: 800000, lock_type: 1 }],
  unit_list: [
    {
      unit_id: 123456,
      unit_master_id: 12302,
      unit_level: 40,
      class: 6,
      runes: [],
      artifacts: [],
    },
  ],
  runes: Array.from({ length: 6 }, (_, index) => ({
    rune_id: 800000 + index,
    slot_no: index + 1,
    set_id: index < 4 ? 3 : 15,
    class: index === 0 ? 16 : 6,
    rank: 5,
    upgrade_curr: 15,
    pri_eff: [1, 2448],
    prefix_eff: [0, 0],
    sec_eff: [
      index === 0 ? [8, 26, 1, 5] : index === 2 ? [8, 30, 0, 5] : [8, 30, 0, 0],
      ...(index === 0 ? [[9, 12, 1, 0]] : []),
    ],
  })),
  artifacts: [{ rid: 700001, slot: 1, rank: 4, level: 15 }],
};

test('importa localmente e permite otimizar um monstro fora da conta', async ({
  page,
}) => {
  await page.goto('/pt/summoners-war/otimizador-de-runas');

  await expect(page.locator('.optimizer-hero h1')).toContainText(
    'Otimizador de Runas',
  );
  await expect(page.locator('.beta-badge')).toHaveText('BETA');

  await page.locator('[data-file-input]').setInputFiles({
    name: 'swex.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(syntheticExport)),
  });
  await expect(page.locator('[data-import-status]')).toContainText(
    '1 monstros · 6 runas · 1 artefatos',
  );
  await expect(page.getByLabel('Permitir runas bloqueadas')).toBeChecked();

  const monsterSearch = page.getByRole('combobox', { name: 'Monstro' });
  await monsterSearch.fill('Tiana');
  await monsterSearch.press('ArrowDown');
  await page.getByRole('option', { name: 'Tiana', exact: true }).press('Enter');
  await expect(monsterSearch).toHaveValue('Tiana');
  await page.getByRole('button', { name: 'Maior SPD' }).click();
  await page.getByRole('button', { name: 'Encontrar builds exatas' }).click();

  await expect(page.locator('.build-result').first()).toBeVisible();
  const firstBuild = page.locator('.build-result').first();
  await expect(firstBuild).toContainText('Swift');
  await expect(firstBuild.locator('.objective-score')).toContainText(
    'SPD Adicional',
  );
  await expect(firstBuild.locator('.objective-score')).toContainText('+231');
  await expect(firstBuild.locator('.objective-score')).toContainText(
    'Total 327',
  );
  await expect(firstBuild.locator('.result-stats thead th')).toHaveText([
    '',
    'Base',
    'Adicional',
    'Total',
  ]);
  await expect(firstBuild).not.toContainText('Atual');
  await expect(firstBuild.locator('[data-rune-card]')).toHaveCount(6);
  const firstRune = firstBuild.locator('[data-rune-card="1"]');
  await expect(firstRune).toContainText('Slot 1 · Swift');
  const firstRuneIcon = firstRune.locator('[data-rune-icon]');
  await expect(
    firstRuneIcon.locator('[data-rune-asset="background"]'),
  ).toHaveAttribute('src', '/images/runes/bg_legend_immemorial.png');
  await expect(
    firstRuneIcon.locator('[data-rune-asset="slot"]'),
  ).toHaveAttribute('src', '/images/runes/rune1.png');
  await expect(
    firstRuneIcon.locator('[data-rune-asset="set"]'),
  ).toHaveAttribute('src', '/images/runes/gold/swift.png');
  await expect
    .poll(() =>
      firstRuneIcon
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const iconPresentation = await firstRuneIcon.evaluate((icon) => {
    const background = icon.querySelector<HTMLElement>(
      '[data-rune-asset="background"]',
    );
    const slot = icon.querySelector<HTMLElement>('[data-rune-asset="slot"]');
    const set = icon.querySelector<HTMLElement>('[data-rune-asset="set"]');
    if (!background || !slot || !set) {
      throw new Error('Rune icon layers were not rendered');
    }

    const wrapperBounds = icon.getBoundingClientRect();
    const backgroundBounds = background.getBoundingClientRect();
    const slotBounds = slot.getBoundingClientRect();
    const setBounds = set.getBoundingClientRect();

    return {
      wrapperWidth: wrapperBounds.width,
      backgroundWidth: backgroundBounds.width,
      slotWidth: slotBounds.width,
      slotHeight: slotBounds.height,
      setWidth: setBounds.width,
      slotCenterX:
        slotBounds.left +
        slotBounds.width / 2 -
        (wrapperBounds.left + wrapperBounds.width / 2),
      slotCenterY:
        slotBounds.top +
        slotBounds.height / 2 -
        (wrapperBounds.top + wrapperBounds.height / 2),
      setCenterX:
        setBounds.left +
        setBounds.width / 2 -
        (wrapperBounds.left + wrapperBounds.width / 2),
      setCenterY:
        setBounds.top +
        setBounds.height / 2 -
        (wrapperBounds.top + wrapperBounds.height / 2),
      slotFilter: getComputedStyle(slot).filter,
      setFilter: getComputedStyle(set).filter,
    };
  });
  expect(iconPresentation.backgroundWidth).toBe(iconPresentation.wrapperWidth);
  expect(iconPresentation.slotWidth).toBeLessThan(
    iconPresentation.wrapperWidth,
  );
  expect(iconPresentation.slotWidth).toBe(35);
  expect(iconPresentation.slotHeight).toBe(42);
  expect(iconPresentation.slotCenterX).toBe(0);
  expect(iconPresentation.slotCenterY).toBe(0);
  expect(iconPresentation.setWidth).toBe(28);
  expect(iconPresentation.setCenterX).toBeCloseTo(-0.58, 1);
  expect(iconPresentation.setCenterY).toBeCloseTo(2.9, 1);
  expect(iconPresentation.slotFilter).toBe('none');
  expect(iconPresentation.setFilter).toBe('none');

  const iconAlignment = await firstBuild
    .locator('[data-rune-icon]')
    .evaluateAll((icons) =>
      icons.map((icon) => {
        const wrapperBounds = icon.getBoundingClientRect();
        const set = icon.querySelector<HTMLElement>('[data-rune-asset="set"]');
        if (!set) throw new Error('Rune set layer was not rendered');
        const slotLayer = icon.querySelector<HTMLElement>(
          '[data-rune-asset="slot"]',
        );
        if (!slotLayer) throw new Error('Rune slot layer was not rendered');
        const setBounds = set.getBoundingClientRect();
        const slotBounds = slotLayer.getBoundingClientRect();
        return {
          slot: icon.getAttribute('data-slot'),
          setWidth: setBounds.width,
          setCenterX:
            setBounds.left +
            setBounds.width / 2 -
            (wrapperBounds.left + wrapperBounds.width / 2),
          setCenterY:
            setBounds.top +
            setBounds.height / 2 -
            (wrapperBounds.top + wrapperBounds.height / 2),
          slotWidth: slotBounds.width,
          slotHeight: slotBounds.height,
          slotCenterX:
            slotBounds.left +
            slotBounds.width / 2 -
            (wrapperBounds.left + wrapperBounds.width / 2),
          slotCenterY:
            slotBounds.top +
            slotBounds.height / 2 -
            (wrapperBounds.top + wrapperBounds.height / 2),
        };
      }),
    );
  expect(iconAlignment).toHaveLength(6);
  expect(iconAlignment.map(({ slot }) => slot)).toEqual([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
  ]);
  const expectedSetOffsets = {
    '1': { x: -0.58, y: 2.9 },
    '2': { x: -1.74, y: 0 },
    '3': { x: -1.16, y: 0 },
    '4': { x: -0.58, y: -3.48 },
    '5': { x: 1.16, y: 0 },
    '6': { x: 1.16, y: -0.58 },
  } as const;
  for (const alignment of iconAlignment) {
    const isVerticalSlot = alignment.slot === '1' || alignment.slot === '4';
    const expectedSetOffset =
      expectedSetOffsets[alignment.slot as keyof typeof expectedSetOffsets];
    expect(alignment.setWidth).toBe(28);
    expect(alignment.setCenterX).toBeCloseTo(expectedSetOffset.x, 1);
    expect(alignment.setCenterY).toBeCloseTo(expectedSetOffset.y, 1);
    expect(alignment.slotWidth).toBe(isVerticalSlot ? 35 : 42);
    expect(alignment.slotHeight).toBe(isVerticalSlot ? 42 : 50);
    expect(alignment.slotCenterX).toBe(0);
    expect(alignment.slotCenterY).toBe(0);
  }
  await expect(firstRuneIcon.locator('.rune-icon-level')).toHaveText('+15');
  const secondRuneIcon = firstBuild
    .locator('[data-rune-card="2"]')
    .locator('[data-rune-icon]');
  await expect(
    secondRuneIcon.locator('[data-rune-asset="background"]'),
  ).toHaveAttribute('src', '/images/runes/bg_legend.png');
  await expect(
    secondRuneIcon.locator('[data-rune-asset="slot"]'),
  ).toHaveAttribute('src', '/images/runes/rune2.png');
  const mainStat = firstRune.locator('[data-rune-source="main"]');
  await expect(mainStat).toContainText('HP');
  await expect(mainStat).toContainText('Status principal');
  await expect(mainStat.locator('.rune-stat-current')).toHaveText('+2.448');
  const upgradedSpeed = firstRune.locator('[data-rune-stat="speed"]');
  await expect(upgradedSpeed.locator('.rune-stat-current')).toHaveText('+31');
  await expect(upgradedSpeed.locator('.rune-stat-current')).toHaveClass(
    /is-upgraded/,
  );
  await expect(upgradedSpeed.locator('.rune-stat-limit')).toHaveText('(+32)');
  await expect(upgradedSpeed.getByRole('img', { name: 'Gemado' })).toHaveText(
    '↻',
  );
  await expect(upgradedSpeed.locator('dd')).toHaveText('+31(+32)↻');
  const alteredCritRate = firstRune.locator('[data-rune-stat="critRate"]');
  await expect(alteredCritRate.locator('dd')).toHaveText('+12%↻');
  await expect(firstRune).not.toContainText('Grind atual');
  await expect(firstRune).not.toContainText('Base +26');
  await expect(firstRune).not.toContainText('Final +32');
  await expect(firstRune).toContainText('Inventário');

  const untouchedSpeed = firstBuild
    .locator('[data-rune-card="2"]')
    .locator('[data-rune-stat="speed"]');
  await expect(untouchedSpeed.locator('.rune-stat-current')).toHaveText('+30');
  await expect(untouchedSpeed.locator('.rune-stat-current')).not.toHaveClass(
    /is-upgraded/,
  );
  await expect(untouchedSpeed.locator('.rune-stat-limit')).toHaveText('(+35)');
  const [limitColor, upgradedColor, untouchedColor] = await Promise.all([
    upgradedSpeed
      .locator('.rune-stat-limit')
      .evaluate((element) => getComputedStyle(element).color),
    upgradedSpeed
      .locator('.rune-stat-current')
      .evaluate((element) => getComputedStyle(element).color),
    untouchedSpeed
      .locator('.rune-stat-current')
      .evaluate((element) => getComputedStyle(element).color),
  ]);
  expect(limitColor).not.toBe(upgradedColor);
  expect(limitColor).not.toBe(untouchedColor);

  const maximumSpeed = firstBuild
    .locator('[data-rune-card="3"]')
    .locator('[data-rune-stat="speed"]');
  await expect(maximumSpeed.locator('.rune-stat-current')).toHaveText('+35');
  await expect(maximumSpeed.locator('.rune-stat-current')).toHaveClass(
    /is-upgraded/,
  );
  await expect(maximumSpeed.locator('.rune-stat-limit')).toHaveText('(+35)');
  await expect(maximumSpeed.locator('dd')).toHaveText('+35(+35)');
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);

  const stored = await page.evaluate(async () => {
    const request = indexedDB.open('playerdojo-rune-optimizer', 1);
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = database.transaction('account', 'readonly');
    const getRequest = transaction.objectStore('account').get('snapshot');
    const snapshot = await new Promise<unknown>((resolve, reject) => {
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    });
    database.close();
    return JSON.stringify(snapshot);
  });
  expect(stored).not.toContain('must-not-be-stored');
  expect(stored).not.toContain('Private test account');
  expect(stored).not.toContain('999999');
});
