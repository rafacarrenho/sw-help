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
    ],
  })),
  artifacts: [{ rid: 700001, slot: 1, rank: 4, level: 15 }],
};

test('importa localmente e permite otimizar um monstro fora da conta', async ({
  page,
}) => {
  await page.goto('/pt/summoners-war/otimizador-de-runas');

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
  const mainStat = firstRune.locator('[data-rune-source="main"]');
  await expect(mainStat).toContainText('HP');
  await expect(mainStat).toContainText('Status principal');
  await expect(mainStat.locator('.rune-stat-current')).toHaveText('+2.448');
  const upgradedSpeed = firstRune.locator('[data-rune-stat="speed"]');
  await expect(upgradedSpeed.locator('.rune-stat-current')).toHaveText('+31');
  await expect(upgradedSpeed.locator('.rune-stat-current')).toHaveClass(
    /is-upgraded/,
  );
  await expect(upgradedSpeed.locator('.rune-stat-limit')).toHaveText(
    '(+32 limite)',
  );
  await expect(upgradedSpeed.getByRole('img', { name: 'Gemado' })).toHaveText(
    '↻',
  );
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
  await expect(untouchedSpeed.locator('.rune-stat-limit')).toHaveText(
    '(+35 limite)',
  );

  const maximumSpeed = firstBuild
    .locator('[data-rune-card="3"]')
    .locator('[data-rune-stat="speed"]');
  await expect(maximumSpeed.locator('.rune-stat-current')).toHaveText('+35');
  await expect(maximumSpeed.locator('.rune-stat-current')).toHaveClass(
    /is-upgraded/,
  );
  await expect(maximumSpeed.locator('.rune-stat-limit')).toHaveText('(limite)');
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
