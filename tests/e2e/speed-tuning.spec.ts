import { test, expect, type Page } from '@playwright/test';

const selectMonster = async (
  page: Page,
  slotIndex: number,
  search: string,
  monsterId: string,
) => {
  const slot = page.locator('[data-tuning-slot]').nth(slotIndex);
  const combobox = slot.getByRole('combobox');
  await combobox.fill(search);
  await page.locator(`#speed-tuning-option-${slotIndex}-${monsterId}`).click();
};

test('monta um time de Siege e calcula a SPD mínima com boost e buff', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/spd-tuning/');
  await expect(page).toHaveTitle(/Spd Tuning/);
  await expect(
    page.locator('.sidebar a[aria-label="Spd Tuning"]'),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.getByLabel('Torre SPD')).toHaveValue('15');
  await expect(page.locator('[data-tuning-slot]')).toHaveCount(3);

  await selectMonster(page, 0, 'bernard', 'bernard-wind-1579');
  const firstSlot = page.locator('[data-tuning-slot]').nth(0);
  await expect(firstSlot.locator('[data-tuning-name]')).toHaveText('Bernard');
  await expect(firstSlot.locator('[data-tuning-boost]')).toBeVisible();
  await expect(firstSlot.locator('[data-tuning-boost-percent]')).toHaveValue(
    '30',
  );
  await expect(firstSlot.locator('[data-tuning-speed-buff]')).toBeVisible();
  await expect(firstSlot.locator('[data-tuning-boost-toggle]')).toBeChecked();
  await expect(
    firstSlot.locator('[data-tuning-speed-buff-toggle]'),
  ).toBeChecked();

  await firstSlot.locator('[data-tuning-rune-speed]').fill('200');
  await selectMonster(page, 1, 'lushen', 'lushen');
  await selectMonster(page, 2, 'kahli', 'kahli-fire-1818');

  const secondSlot = page.locator('[data-tuning-slot]').nth(1);
  const thirdSlot = page.locator('[data-tuning-slot]').nth(2);
  await expect(secondSlot.locator('[data-tuning-result-value]')).toHaveText(
    /^\+\d+ SPD$/,
  );
  await expect(thirdSlot.locator('[data-tuning-result-value]')).toHaveText(
    /^\+\d+ SPD$/,
  );
  await expect(secondSlot.locator('[data-tuning-artifact]')).toBeVisible();
  await expect(thirdSlot.locator('[data-tuning-artifact]')).toBeVisible();

  const boostedSecondSpeed = await secondSlot
    .locator('[data-tuning-result-value]')
    .textContent();
  await firstSlot.locator('[data-tuning-boost-toggle]').uncheck();
  await expect(secondSlot.locator('[data-tuning-result-value]')).not.toHaveText(
    boostedSecondSpeed ?? '',
  );

  await firstSlot.locator('[data-tuning-speed-buff-toggle]').uncheck();
  await expect(secondSlot.locator('[data-tuning-artifact]')).toBeHidden();
  await expect(thirdSlot.locator('[data-tuning-artifact]')).toBeHidden();

  await firstSlot.getByLabel('Usa Swift').check();
  await expect(firstSlot.locator('[data-tuning-result-value]')).toHaveText(
    /SPD$/,
  );
  expect(errors).toEqual([]);
});

test('aplica boost de alvo único e mantém somente uma liderança ativa', async ({
  page,
}) => {
  await page.goto('/spd-tuning/');
  await selectMonster(page, 0, 'konamiya', 'konamiya-water-56');
  const firstSlot = page.locator('[data-tuning-slot]').nth(0);
  await expect(firstSlot.locator('[data-tuning-boost-percent]')).toHaveValue(
    '100',
  );
  await expect(firstSlot.locator('[data-tuning-effect-target]')).toBeVisible();
  await expect(firstSlot.locator('[data-tuning-target]')).toHaveValue('1');
  await firstSlot.locator('[data-tuning-target]').selectOption('2');
  await expect(firstSlot.locator('[data-tuning-target]')).toHaveValue('2');

  await page.getByRole('button', { name: 'Limpar time' }).click();
  await selectMonster(page, 0, 'clara', 'clara');
  await selectMonster(page, 1, 'garo', 'garo-fire-246');
  const secondSlot = page.locator('[data-tuning-slot]').nth(1);
  const firstLeader = firstSlot.locator('[data-tuning-leader-toggle]');
  const secondLeader = secondSlot.locator('[data-tuning-leader-toggle]');

  await firstLeader.check();
  await expect(firstLeader).toBeChecked();
  await secondLeader.check();
  await expect(secondLeader).toBeChecked();
  await expect(firstLeader).not.toBeChecked();

  await page.getByRole('button', { name: 'Limpar time' }).click();
  await expect(page.getByLabel('Torre SPD')).toHaveValue('15');
  await expect(firstSlot.getByRole('combobox')).toHaveValue('');
  await expect(firstSlot.locator('[data-tuning-result-value]')).toHaveText('—');
});

test('aplica limite estrito no tuning de Kabilla, Gemini e Talisman', async ({
  page,
}) => {
  await page.goto('/spd-tuning/');
  await selectMonster(page, 0, 'kabilla', 'kabilla-light-430');
  await selectMonster(page, 1, 'gemini', 'gemini-light-657');
  await selectMonster(page, 2, 'talisman', 'talisman-light-1680');

  const slots = page.locator('[data-tuning-slot]');
  const firstSlot = slots.nth(0);
  const secondSlot = slots.nth(1);
  const thirdSlot = slots.nth(2);

  await firstSlot.locator('[data-tuning-rune-speed]').fill('230');
  await firstSlot.getByLabel('Usa Swift').check();
  await secondSlot.getByLabel('Usa Swift').check();
  await thirdSlot.getByLabel('Usa Swift').check();
  await secondSlot.locator('[data-tuning-leader-toggle]').check();

  await expect(firstSlot.locator('[data-tuning-result-value]')).toHaveText(
    '391 SPD',
  );
  await expect(secondSlot.locator('[data-tuning-result-value]')).toHaveText(
    '+178 SPD',
  );
  await expect(thirdSlot.locator('[data-tuning-result-value]')).toHaveText(
    '+182 SPD',
  );
});

test('empilha os slots no mobile sem criar rolagem horizontal', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/spd-tuning/');

  const slots = page.locator('[data-tuning-slot]');
  const boxes = await slots.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, left: rect.left, width: rect.width };
    }),
  );
  expect(boxes[1]!.top).toBeGreaterThan(boxes[0]!.top);
  expect(boxes[2]!.top).toBeGreaterThan(boxes[1]!.top);
  expect(Math.abs(boxes[0]!.left - boxes[1]!.left)).toBeLessThan(1);
  expect(Math.abs(boxes[0]!.width - boxes[1]!.width)).toBeLessThan(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
