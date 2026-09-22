import { test, expect } from '@playwright/test';

test('desktop persiste a escolha entre páginas e recargas', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');

  await page.goto('/');
  const sidebar = page.locator('[data-sidebar]');
  const workspace = page.locator('.workspace');
  const toggle = page.getByRole('button', { name: 'Recolher menu lateral' });
  const brandSymbol = page.locator('.sidebar .brand-symbol');

  await expect(sidebar).toHaveCSS('width', '264px');
  await expect(workspace).toHaveCSS('margin-left', '264px');
  const expandedToggleBox = await toggle.boundingBox();
  const expandedBrandBox = await brandSymbol.boundingBox();
  expect(expandedToggleBox).not.toBeNull();
  expect(expandedBrandBox).not.toBeNull();
  expect(
    Math.abs(
      expandedToggleBox!.y +
        expandedToggleBox!.height / 2 -
        (expandedBrandBox!.y + expandedBrandBox!.height / 2),
    ),
  ).toBeLessThanOrEqual(1);

  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/nav-collapsed/);
  await expect(sidebar).toHaveCSS('width', '80px');
  await expect(workspace).toHaveCSS('margin-left', '80px');
  await expect(
    page.getByRole('button', { name: 'Expandir menu lateral' }),
  ).toHaveAttribute('aria-expanded', 'false');
  const collapsedToggleBox = await page
    .getByRole('button', { name: 'Expandir menu lateral' })
    .boundingBox();
  const collapsedBrandBox = await brandSymbol.boundingBox();
  expect(collapsedToggleBox).not.toBeNull();
  expect(collapsedBrandBox).not.toBeNull();
  expect(
    Math.abs(
      collapsedToggleBox!.x +
        collapsedToggleBox!.width / 2 -
        (collapsedBrandBox!.x + collapsedBrandBox!.width / 2),
    ),
  ).toBeLessThanOrEqual(1);

  const catalogLink = page.getByRole('link', {
    name: 'Catálogo de Monstros',
  });
  const tooltip = page.locator('[data-nav-tooltip]');
  await catalogLink.hover();
  await expect(tooltip).toHaveText('Catálogo de Monstros');
  await expect(tooltip).toHaveClass(/is-visible/);
  const tooltipBox = await tooltip.boundingBox();
  expect(tooltipBox).not.toBeNull();
  expect(tooltipBox!.x).toBeGreaterThanOrEqual(90);
  await catalogLink.focus();
  await expect(catalogLink).toHaveAttribute('aria-describedby', 'nav-tooltip');

  await catalogLink.click();
  await expect(page).toHaveURL(/\/monstros\/$/);
  await expect(sidebar).toHaveCSS('width', '80px');
  await expect(page.locator('html')).toHaveClass(/nav-collapsed/);
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('sw-help:sidebar-collapsed'),
    ),
  ).toBe('true');

  await page.getByRole('button', { name: 'Expandir menu lateral' }).click();
  await page.reload();
  await expect(sidebar).toHaveCSS('width', '264px');
  await expect(page.locator('html')).not.toHaveClass(/nav-collapsed/);
  expect(
    await page.evaluate(() =>
      window.localStorage.getItem('sw-help:sidebar-collapsed'),
    ),
  ).toBe('false');
});

test('mobile abre como drawer e fecha por Escape e backdrop', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');

  await page.addInitScript(() => {
    window.localStorage.setItem('sw-help:sidebar-collapsed', 'true');
  });
  await page.goto('/');
  const sidebar = page.locator('[data-sidebar]');
  const openButton = page.getByRole('button', { name: 'Abrir menu' });
  const mobileBrand = page.locator('.mobile-brand');
  const backdrop = page.locator('[data-sidebar-backdrop]');

  await expect(sidebar).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/mobile-nav-open/);
  const openButtonBox = await openButton.boundingBox();
  const mobileBrandBox = await mobileBrand.boundingBox();
  expect(openButtonBox).not.toBeNull();
  expect(mobileBrandBox).not.toBeNull();
  expect(openButtonBox!.x + openButtonBox!.width).toBeLessThan(
    mobileBrandBox!.x,
  );
  await openButton.click();
  await expect(sidebar).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('body')).toHaveClass(/mobile-nav-open/);
  await expect(page.locator('[data-mobile-menu-close]')).toBeFocused();
  await expect(backdrop).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Escape');
  await expect(sidebar).toHaveAttribute('aria-hidden', 'true');
  await expect(openButton).toBeFocused();

  await openButton.click();
  await backdrop.click({ position: { x: 380, y: 100 } });
  await expect(sidebar).toHaveAttribute('aria-hidden', 'true');
  await expect(openButton).toBeFocused();
});
