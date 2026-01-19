import { test, expect } from '@playwright/test';

test('Strona główna ładuje się poprawnie', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'Znajdź swój wymarzony samochód lub część',
    })
  ).toBeVisible();

  await expect(page).toHaveTitle(/Market/i);

  const searchInput = page.getByPlaceholder('Czego szukasz? (np. Audi A4, Alternator)');
  await expect(searchInput).toBeVisible();

  await expect(page.getByRole('link', { name: /Samochody/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Części/i })).toBeVisible();
});
