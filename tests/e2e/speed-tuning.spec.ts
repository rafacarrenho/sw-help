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
  await expect(firstSlot.locator('[data-tuning-boost-toggle]')).toHaveCount(0);
  await expect(firstSlot.locator('[data-tuning-boost-skill]')).toHaveCount(0);
  await expect(firstSlot.locator('[data-tuning-speed-buff-skill]')).toHaveCount(
    0,
  );
  await expect(
    firstSlot.locator('[data-tuning-speed-buff-toggle]'),
  ).toBeChecked();

  const swiftControl = firstSlot.getByLabel('Usa Swift');
  const speedBuffControl = firstSlot.locator('[data-tuning-speed-buff]');
  for (const control of [swiftControl.locator('..'), speedBuffControl]) {
    await expect(control).toHaveClass('speed-tuning-check');
    expect(
      await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          background: style.backgroundColor,
          border: style.borderTopWidth,
          parent: element.parentElement?.className,
        };
      }),
    ).toEqual({
      background: 'rgba(0, 0, 0, 0)',
      border: '0px',
      parent: 'speed-tuning-fields',
    });
  }

  expect(
    await firstSlot.locator('[data-tuning-summary]').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        border: style.borderTopWidth,
        padding: style.paddingTop,
      };
    }),
  ).toEqual({
    background: 'rgba(0, 0, 0, 0)',
    border: '0px',
    padding: '0px',
  });

  await expect(firstSlot.locator('[data-tuning-boost]')).toHaveClass(
    'speed-tuning-field',
  );
  const runeInputWidth = await firstSlot
    .locator('[data-tuning-rune-speed]')
    .evaluate((element) => element.getBoundingClientRect().width);
  const boostInputWidth = await firstSlot
    .locator('[data-tuning-boost-percent]')
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(Math.abs(runeInputWidth - boostInputWidth)).toBeLessThan(1);

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
  await expect(secondSlot.locator('[data-tuning-artifact]')).toHaveClass(
    'speed-tuning-field',
  );
  expect(
    await secondSlot.locator('[data-tuning-artifact]').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        border: style.borderTopWidth,
        directInput:
          element.querySelector(':scope > [data-tuning-artifact-percent]') !==
          null,
      };
    }),
  ).toEqual({
    background: 'rgba(0, 0, 0, 0)',
    border: '0px',
    directInput: true,
  });

  const boostedSecondSpeed = await secondSlot
    .locator('[data-tuning-result-value]')
    .textContent();
  await firstSlot.locator('[data-tuning-boost-percent]').fill('0');
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
  await firstSlot.locator('[data-tuning-boost-percent]').fill('0');
  await expect(firstSlot.locator('[data-tuning-effect-target]')).toBeVisible();
  await firstSlot.locator('[data-tuning-target]').selectOption('2');
  await expect(firstSlot.locator('[data-tuning-target]')).toHaveValue('2');

  await page.getByRole('button', { name: 'Limpar time' }).click();
  await selectMonster(page, 0, 'clara', 'clara');
  const firstLeader = firstSlot.locator('[data-tuning-leader-toggle]');
  await expect(firstLeader).toBeChecked();

  await selectMonster(page, 1, 'garo', 'garo-fire-246');
  const secondSlot = page.locator('[data-tuning-slot]').nth(1);
  const secondLeader = secondSlot.locator('[data-tuning-leader-toggle]');
  await expect(secondLeader).toBeChecked();
  await expect(secondLeader.locator('..')).toHaveClass('speed-tuning-check');
  await expect(firstLeader).not.toBeChecked();

  await selectMonster(page, 2, 'gemini', 'gemini-light-657');
  const thirdSlot = page.locator('[data-tuning-slot]').nth(2);
  const thirdLeader = thirdSlot.locator('[data-tuning-leader-toggle]');
  await expect(secondLeader).toBeChecked();
  await expect(thirdLeader).not.toBeChecked();

  await firstLeader.check();
  await expect(firstLeader).toBeChecked();
  await expect(secondLeader).not.toBeChecked();

  await selectMonster(page, 2, 'sylvia', 'sylvia-dark-882');
  await expect(thirdLeader).toBeChecked();
  await expect(firstLeader).not.toBeChecked();
  await thirdSlot.getByRole('combobox').fill('');
  await expect(secondLeader).toBeChecked();

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
  await selectMonster(page, 0, 'bernard', 'bernard-wind-1579');

  const slots = page.locator('[data-tuning-slot]');
  const boxes = await slots.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }),
  );
  expect(boxes[1]!.top).toBeGreaterThan(boxes[0]!.top);
  expect(boxes[2]!.top).toBeGreaterThan(boxes[1]!.top);
  expect(Math.abs(boxes[0]!.left - boxes[1]!.left)).toBeLessThan(1);
  expect(Math.abs(boxes[0]!.width - boxes[1]!.width)).toBeLessThan(1);

  const firstArrowBox = await slots
    .nth(0)
    .locator('.speed-tuning-arrow')
    .boundingBox();
  expect(firstArrowBox).not.toBeNull();
  expect(firstArrowBox!.y).toBeGreaterThan(boxes[0]!.top + boxes[0]!.height);
  expect(firstArrowBox!.y + firstArrowBox!.height).toBeLessThan(boxes[1]!.top);
  expect(
    Math.abs(
      firstArrowBox!.x +
        firstArrowBox!.width / 2 -
        (boxes[0]!.left + boxes[0]!.width / 2),
    ),
  ).toBeLessThan(1);

  const firstSummary = slots.nth(0).locator('[data-tuning-summary]');
  const [monsterCopyBox, baseSpeedBox] = await Promise.all([
    firstSummary.locator('.speed-tuning-monster-copy').boundingBox(),
    firstSummary.locator('.speed-tuning-base').boundingBox(),
  ]);
  expect(monsterCopyBox).not.toBeNull();
  expect(baseSpeedBox).not.toBeNull();
  expect(
    Math.abs(
      monsterCopyBox!.y +
        monsterCopyBox!.height / 2 -
        (baseSpeedBox!.y + baseSpeedBox!.height / 2),
    ),
  ).toBeLessThan(1);
  expect(baseSpeedBox!.x).toBeGreaterThan(monsterCopyBox!.x);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
