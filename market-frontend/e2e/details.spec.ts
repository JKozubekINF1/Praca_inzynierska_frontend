import { test, expect } from '@playwright/test';

test.describe('Szczegóły Ogłoszenia', () => {
  test.setTimeout(60000);

  const mockAnnouncement = {
    id: 999,
    title: 'Legendarny Passat 1.9 TDI',
    price: 5000,
    description: 'Samochód w stanie idealnym, trzymany pod kocem.',
    location: 'Radom',
    category: 'Pojazd',
    userId: 10,
    user: { id: 10, username: 'Janusz', phoneNumber: '555-666-777' },
    photos: [],
    vehicleDetails: {
      brand: 'Volkswagen',
      model: 'Passat',
      year: 2001,
      mileage: 300000,
      fuelType: 'Diesel',
      gearbox: 'Manualna',
    },
  };

  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/announcements\/999/i, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAnnouncement),
      });
    });

    await page.goto('/announcements/999');
  });

  test('Wyświetla poprawne informacje o ogłoszeniu', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Legendarny Passat 1.9 TDI' })).toBeVisible();

    await expect(page.getByText(/5\s?000/).first()).toBeVisible();

    await expect(page.getByText('Radom')).toBeVisible();

    await expect(page.getByText('Volkswagen', { exact: true })).toBeVisible();
    await expect(page.getByText('Passat', { exact: true })).toBeVisible();
    await expect(page.getByText('Diesel', { exact: true })).toBeVisible();
  });

  test('Próba zakupu bez logowania przekierowuje do logowania', async ({ page }) => {
    await page.click('button:has-text("KUP TERAZ")');

    await expect(page).toHaveURL(/\/login/);
  });
});
