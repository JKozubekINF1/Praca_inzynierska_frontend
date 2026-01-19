import { test, expect } from '@playwright/test';

test.describe('Strona Wyszukiwania', () => {
  test.setTimeout(60000);

  const mockResults = {
    items: [
      {
        objectID: 1,
        id: 1,
        title: 'Audi A4 B8 S-Line',
        price: 45000,
        location: 'Warszawa',
        category: 'Pojazd',
        photoUrl: 'https://placehold.co/400',
        createdAt: new Date().toISOString(),
        vehicleDetails: {
          brand: 'Audi',
          model: 'A4',
          year: 2012,
          mileage: 150000,
          fuelType: 'Diesel',
        },
      },
      {
        objectID: 2,
        id: 2,
        title: 'Opony Zimowe 16 cali',
        price: 800,
        location: 'Kraków',
        category: 'Część',
        photoUrl: null,
        createdAt: new Date().toISOString(),
        partDetails: { partName: 'Opony' },
      },
    ],
    totalHits: 2,
    totalPages: 1,
    currentPage: 0,
  };

  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/Announcements\/search/i, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResults),
      });
    });

    await page.goto('/search');
  });

  test('Wyświetla listę ogłoszeń i sortowanie', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ogłoszenia' })).toBeVisible();

    await expect(page.getByText('Audi A4 B8 S-Line')).toBeVisible();
    await expect(page.getByText('Opony Zimowe 16 cali')).toBeVisible();

    const sortSelect = page.locator('select').first();
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption('price_asc');
  });

  test('Filtrowanie: Wybór kategorii "Pojazd" pokazuje dodatkowe pola', async ({ page }) => {
    await expect(page.locator('input[name="brand"]')).not.toBeVisible();

    await page.selectOption('select[name="category"]', 'Pojazd');

    await expect(page.locator('input[name="brand"]')).toBeVisible();

    await page.fill('input[name="brand"]', 'Audi');
    await page.fill('input[name="minPrice"]', '10000');

    await page.click('button:has-text("Pokaż wyniki")');

    await expect(page).toHaveURL(/category=Pojazd/);
    await expect(page).toHaveURL(/brand=Audi/);
  });

  test('Obsługa braku wyników', async ({ page }) => {
    await page.route(/\/api\/Announcements\/search/i, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], totalHits: 0, totalPages: 0, currentPage: 0 }),
      });
    });
    await page.click('button:has-text("Pokaż wyniki")');

    await expect(page.getByText('Brak wyników')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Zmień kryteria wyszukiwania')).toBeVisible();
  });
});
