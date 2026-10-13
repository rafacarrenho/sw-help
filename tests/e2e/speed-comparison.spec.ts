import { test, expect } from '@playwright/test';
import { seedEssentialPrivacyPreferences } from './helpers/privacy';

test.beforeEach(async ({ page }) => {
  await seedEssentialPrivacyPreferences(page);
});

const allyCard = (page: import('@playwright/test').Page) =>
  page.locator('[data-comparison-side="ally"]');
const enemyCard = (page: import('@playwright/test').Page) =>
  page.locator('[data-comparison-side="enemy"]');

test('compara Adriana com líder 24 e Swift contra Triton sem líder', async ({
  page,
}) => {
  await page.goto('/pt/summoners-war/comparador-spd');

  const ally = allyCard(page);
  const enemy = enemyCard(page);
  await expect(
    page.getByRole('group', { name: 'Conteúdo da batalha' }),
  ).toHaveCount(0);
  await expect(ally.getByLabel('Usa Swift')).toBeChecked();
  await expect(enemy.getByLabel('Usa Swift')).toBeChecked();
  await ally.getByRole('combobox', { name: 'Monstro' }).fill('Adriana');
  await ally.getByRole('option', { name: /Adriana/ }).click();
  await ally.getByLabel('Liderança de SPD').selectOption('24');

  const enemySearch = enemy.getByRole('combobox', { name: 'Monstro' });
  await enemySearch.fill('Triton');
  await enemySearch.press('ArrowDown');
  await enemySearch.press('Enter');
  await expect(ally.getByLabel('Usa Swift')).toBeChecked();
  await expect(enemy.getByLabel('Usa Swift')).toBeChecked();

  await expect(ally.locator('[data-comparison-speed]')).toHaveText('183 SPD');
  await expect(enemy.locator('[data-comparison-speed]')).toHaveText('163 SPD');
  await expect(ally.locator('[data-comparison-status]')).toHaveText('VANTAGEM');
  await expect(enemy.locator('[data-comparison-status]')).toHaveText(
    'DESVANTAGEM',
  );
  await expect(ally.locator('.speed-comparison-card-result')).toHaveClass(
    /is-advantage/,
  );
  await expect(enemy.locator('.speed-comparison-card-result')).toHaveClass(
    /is-disadvantage/,
  );
  await expect(
    page.getByRole('heading', { name: 'Adriana tem vantagem de 20 SPD' }),
  ).toBeVisible();
  await expect(page.locator('[data-comparison-result-copy]')).toContainText(
    'até 19 SPD adicional a menos',
  );
  await expect(page.locator('[data-comparison-tie-copy]')).toContainText(
    'Com 20 SPD adicional a menos',
  );
  await expect(page).toHaveURL(/ally=adriana-water-2021/);
  await expect(page).toHaveURL(/allyLeader=24/);
  await expect(page).toHaveURL(/enemy=triton-wind-847/);
  await expect(page).not.toHaveURL(/mode=/);
  await expect(page).not.toHaveURL(/(?:ally|enemy)Swift=/);
});

test('oferece todas as lideranças e normaliza Swift e conteúdo legados', async ({
  page,
}) => {
  await page.goto(
    '/pt/summoners-war/comparador-spd?mode=arena&ally=adriana-water-2021&allyLeader=30&allySwift=1&allyTower=14&enemy=triton-wind-847&enemyTower=13',
  );

  const ally = allyCard(page);
  const enemy = enemyCard(page);
  await expect(ally.getByRole('combobox', { name: 'Monstro' })).toHaveValue(
    'Adriana',
  );
  await expect(enemy.getByRole('combobox', { name: 'Monstro' })).toHaveValue(
    'Triton',
  );
  await expect(ally.getByLabel('Liderança de SPD')).toHaveValue('30');
  await expect(
    ally.getByLabel('Liderança de SPD').locator('option'),
  ).toHaveText([
    'Sem líder',
    '10%',
    '15%',
    '16%',
    '17%',
    '19%',
    '20%',
    '21%',
    '23%',
    '24%',
    '28%',
    '30%',
    '33%',
  ]);
  await expect(ally.getByLabel('Torre aliada')).toHaveValue('14');
  await expect(enemy.getByLabel('Torre inimiga')).toHaveValue('13');
  await expect(ally.getByLabel('Usa Swift')).toBeChecked();
  await expect(enemy.getByLabel('Usa Swift')).toBeChecked();
  await expect(page).not.toHaveURL(/mode=/);
  await expect(page).not.toHaveURL(/allySwift=1/);

  await ally.getByLabel('Liderança de SPD').selectOption('20');
  await expect(ally.getByLabel('Liderança de SPD')).toHaveValue('20');
  await expect(
    ally.getByLabel('Liderança de SPD').locator('option[value="20"]'),
  ).toHaveCount(1);
  await expect(
    enemy.getByLabel('Liderança de SPD').locator('option[value="30"]'),
  ).toHaveCount(1);
  await enemy.getByLabel('Usa Swift').uncheck();
  await expect(page).toHaveURL(/enemySwift=0/);

  await page.reload();
  await expect(ally.getByLabel('Liderança de SPD')).toHaveValue('20');
  await expect(ally.getByLabel('Usa Swift')).toBeChecked();
  await expect(enemy.getByLabel('Usa Swift')).not.toBeChecked();
});

test('aplica a passiva do Chilling conforme os buffs iniciais', async ({
  page,
}, testInfo) => {
  await page.goto(
    '/pt/summoners-war/comparador-spd?ally=chilling-water-958&enemy=triton-wind-847',
  );

  const ally = allyCard(page);
  const enemy = enemyCard(page);
  const initialBuffs = ally.getByLabel('Buffs iniciais');

  await expect(initialBuffs).toBeVisible();
  await expect(initialBuffs).toHaveValue('2');
  await expect(ally.locator('[data-comparison-speed]')).toHaveText('182 SPD');
  await expect(enemy.getByLabel('Buffs iniciais')).toBeHidden();
  expect(new URL(page.url()).searchParams.has('allyStartBuffs')).toBe(false);

  if (testInfo.project.name === 'desktop') {
    const allyResult = await ally
      .locator('.speed-comparison-card-result')
      .boundingBox();
    const enemyResult = await enemy
      .locator('.speed-comparison-card-result')
      .boundingBox();
    expect(allyResult).not.toBeNull();
    expect(enemyResult).not.toBeNull();
    expect(allyResult!.y).toBe(enemyResult!.y);
  }

  await initialBuffs.selectOption('1');
  await expect(ally.locator('[data-comparison-speed]')).toHaveText('162 SPD');
  await expect(page).toHaveURL(/allyStartBuffs=1/);

  await page.reload();
  await expect(initialBuffs).toHaveValue('1');
  await expect(ally.locator('[data-comparison-speed]')).toHaveText('162 SPD');

  await ally.getByRole('combobox', { name: 'Monstro' }).fill('Adriana');
  await ally.getByRole('option', { name: /Adriana/ }).click();
  await expect(initialBuffs).toBeHidden();
  await expect(page).not.toHaveURL(/allyStartBuffs=/);
});

test('compara SPD adicional em zero, um ou dois lados', async ({ page }) => {
  await page.goto(
    '/pt/summoners-war/comparador-spd?ally=chilling-water-958&enemy=triton-wind-847',
  );

  const ally = allyCard(page);
  const enemy = enemyCard(page);
  const allySpeed = ally.getByLabel('SPD adicional (opcional)');
  const enemySpeed = enemy.getByLabel('SPD adicional (opcional)');

  await expect(ally.locator('[data-comparison-speed]')).toHaveText('182 SPD');
  await expect(enemy.locator('[data-comparison-speed]')).toHaveText('163 SPD');

  await allySpeed.fill('112');
  await expect(ally.locator('[data-comparison-speed-label]')).toHaveText(
    'SPD de combate',
  );
  await expect(ally.locator('[data-comparison-speed]')).toHaveText('268 SPD');
  await expect(ally.locator('[data-comparison-speed-copy]')).toHaveText(
    '213 SPD total (101 base + 112)',
  );
  await expect(enemy.locator('[data-comparison-speed-label]')).toHaveText(
    'SPD adicional necessária',
  );
  await expect(enemy.locator('[data-comparison-speed]')).toHaveText('+135 SPD');
  await expect(enemy.locator('[data-comparison-speed-copy]')).toHaveText(
    '+134 para empatar · 250 SPD total',
  );
  await expect(
    page.getByRole('heading', {
      name: 'Triton precisa de +135 SPD adicional (251 total) para ultrapassar Chilling',
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(/allyBonusSpd=112/);

  await enemySpeed.fill('134');
  await expect(
    page.getByRole('heading', { name: 'Empate em SPD de combate' }),
  ).toBeVisible();
  await expect(ally.locator('[data-comparison-speed]')).toHaveText('268 SPD');
  await expect(enemy.locator('[data-comparison-speed]')).toHaveText('268 SPD');
  await expect(page).toHaveURL(/enemyBonusSpd=134/);

  await enemySpeed.fill('135');
  await expect(
    page.getByRole('heading', { name: 'Triton age primeiro por 1 SPD' }),
  ).toBeVisible();
  await expect(enemy.locator('[data-comparison-speed]')).toHaveText('269 SPD');

  await allySpeed.fill('');
  await expect(ally.locator('[data-comparison-speed]')).toHaveText('+114 SPD');
  await expect(ally.locator('[data-comparison-speed-copy]')).toHaveText(
    '+113 para empatar · 214 SPD total',
  );
  await expect(page).not.toHaveURL(/allyBonusSpd=/);
});

test('valida a SPD adicional possível e restaura builds pela URL', async ({
  page,
}) => {
  await page.goto('/pt/summoners-war/comparador-spd');
  const ally = allyCard(page);
  const enemy = enemyCard(page);
  await expect(ally.getByLabel('SPD adicional (opcional)')).toBeDisabled();

  await page.goto(
    '/pt/summoners-war/comparador-spd?ally=chilling-water-958&allyBonusSpd=112&enemy=triton-wind-847&enemyBonusSpd=3',
  );
  const allySpeed = ally.getByLabel('SPD adicional (opcional)');
  const enemySpeed = enemy.getByLabel('SPD adicional (opcional)');
  await expect(allySpeed).toHaveValue('112');
  await expect(enemySpeed).toHaveValue('');
  await expect(page).not.toHaveURL(/enemyBonusSpd=/);

  await enemySpeed.fill('3');
  await expect(enemySpeed).toHaveAttribute('aria-invalid', 'true');
  await expect(
    enemy.locator('[data-comparison-additional-error]'),
  ).toContainText('pelo menos +29');
  await expect(
    page.getByRole('heading', { name: 'Corrija a SPD adicional' }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/enemyBonusSpd=/);
});

test('inverte vantagem, representa empate e limpa os estados semânticos', async ({
  page,
}) => {
  await page.goto(
    '/pt/summoners-war/comparador-spd?ally=adriana-water-2021&enemy=triton-wind-847&enemySwift=1',
  );
  const ally = allyCard(page);
  const enemy = enemyCard(page);

  await expect(ally.locator('[data-comparison-status]')).toHaveText(
    'DESVANTAGEM',
  );
  await expect(enemy.locator('[data-comparison-status]')).toHaveText(
    'VANTAGEM',
  );
  await expect(ally.locator('.speed-comparison-card-result')).toHaveClass(
    /is-disadvantage/,
  );
  await expect(enemy.locator('.speed-comparison-card-result')).toHaveClass(
    /is-advantage/,
  );

  await page.goto(
    '/pt/summoners-war/comparador-spd?ally=adriana-water-2021&enemy=adriana-water-2021',
  );
  await expect(ally.locator('[data-comparison-status]')).toHaveText('EMPATE');
  await expect(enemy.locator('[data-comparison-status]')).toHaveText('EMPATE');
  await expect(ally.locator('.speed-comparison-card-result')).toHaveClass(
    /is-tie/,
  );
  await expect(enemy.locator('.speed-comparison-card-result')).toHaveClass(
    /is-tie/,
  );

  await enemy.getByRole('button', { name: 'Limpar monstro inimigo' }).click();
  await expect(enemy.locator('[data-comparison-status]')).toBeHidden();
  await expect(ally.locator('[data-comparison-status]')).toBeHidden();
  await expect(enemy.getByLabel('Usa Swift')).toBeChecked();
  await expect(enemy.getByLabel('Usa Swift')).toBeDisabled();
  await expect(ally.locator('.speed-comparison-card-result')).not.toHaveClass(
    /is-(advantage|disadvantage|tie)/,
  );
});

test('abre pelo menu e empilha os lados no celular', async ({
  page,
}, testInfo) => {
  await page.goto('/pt/summoners-war');
  const comparisonNavigationLink = page.locator(
    '.nav-item[aria-label="Comparador de SPD"]',
  );

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
  }
  await comparisonNavigationLink.click();
  await expect(page).toHaveURL(/\/pt\/summoners-war\/comparador-spd$/);
  await expect(comparisonNavigationLink).toHaveAttribute(
    'aria-current',
    'page',
  );

  if (testInfo.project.name !== 'mobile') return;
  const allyBox = await allyCard(page).boundingBox();
  const enemyBox = await enemyCard(page).boundingBox();
  expect(allyBox).not.toBeNull();
  expect(enemyBox).not.toBeNull();
  expect(enemyBox!.y).toBeGreaterThan(allyBox!.y + allyBox!.height);
  const viewport = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.innerWidth);
});
