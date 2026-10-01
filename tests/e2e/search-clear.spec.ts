import { test, expect } from '@playwright/test';

test('mantém a ação de limpar visível em todas as buscas preenchidas', async ({
  page,
}) => {
  await page.goto('/pt/summoners-war/siege-counter');
  let search = page.getByRole('searchbox');
  let clear = page.getByRole('button', { name: 'Limpar busca' });
  await expect(clear).toBeHidden();
  await search.fill('Morris');
  await search.blur();
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(clear).toBeHidden();

  await page.goto('/pt/summoners-war/monstros');
  search = page.getByRole('searchbox');
  clear = page.getByRole('button', { name: 'Limpar busca' });
  await expect(clear).toBeHidden();
  await search.fill('Nora');
  await search.blur();
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(clear).toBeHidden();

  await page.goto('/pt/summoners-war/spd-tick');
  search = page.getByRole('combobox', { name: 'Monstro' });
  clear = page.getByRole('button', { name: 'Limpar busca' });
  await expect(clear).toBeHidden();
  await search.fill('Bernard');
  await page.locator('#speed-tick-monster-option-bernard-wind-1579').click();
  await expect(search).toHaveValue('Bernard');
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(clear).toBeHidden();
  await expect(page.locator('#speed-tick-monster-name')).toHaveText(
    'Nenhum monstro selecionado',
  );

  await page.goto('/pt/summoners-war/spd-tuning');
  const slots = page.locator('[data-tuning-slot]:visible');
  await expect(slots).toHaveCount(3);
  for (const slot of await slots.all()) {
    await expect(
      slot.getByRole('button', { name: 'Limpar busca' }),
    ).toBeHidden();
  }
  const firstSlot = slots.first();
  search = firstSlot.getByRole('combobox', { name: 'Monstro 1' });
  clear = firstSlot.getByRole('button', { name: 'Limpar busca' });
  await search.fill('Bernard');
  await page.locator('#speed-tuning-option-0-bernard-wind-1579').click();
  await expect(search).toHaveValue('Bernard');
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(clear).toBeHidden();
  await expect(firstSlot.locator('[data-tuning-name]')).toHaveText(
    'Nenhum monstro',
  );
});
