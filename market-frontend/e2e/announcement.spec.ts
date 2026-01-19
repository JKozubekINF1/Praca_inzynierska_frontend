import { test, expect } from '@playwright/test';

test.describe('Zarządzanie Ogłoszeniami', () => {
  test.setTimeout(60000);

  const user = {
    username: 'Kozub',
    password: 'Qwerty123!',
  };

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('market_cookie_consent', 'true');
    });

    await page.goto('/login');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);

    const recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
    const checkbox = recaptchaFrame.getByRole('checkbox');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true', { timeout: 15000 });

    await page.click('button[type="submit"]', { force: true });
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible({ timeout: 20000 });
  });

  test('Użytkownik może dodać ogłoszenie (Pojazd) ze zdjęciem', async ({ page }) => {
    await page.getByRole('link', { name: 'Dodaj', exact: false }).click();
    await expect(page.getByRole('heading', { name: 'Dodaj ogłoszenie' })).toBeVisible({
      timeout: 30000,
    });

    await page.selectOption('select', 'Pojazd');

    await page.fill('input[name="title"]', 'Sprzedam BMW E46 Gruz');
    await page.fill('input[name="price"]', '12000');
    await page.fill('textarea[name="description"]', 'Stan igła, nic nie stuka, nic nie puka.');

    await page.fill('input[name="location"]', 'Wrocław');
    await page.locator('input[name="location"]').blur();

    await page.fill('input[name="phoneNumber"]', '123456789');

    await expect(page.locator('input[name="brand"]')).toBeVisible();

    await page.fill('input[name="brand"]', 'BMW');
    await page.fill('input[name="model"]', 'Seria 3');
    await page.fill('input[name="year"]', '2004');
    await page.fill('input[name="mileage"]', '250000');
    await page.fill('input[name="engineCapacity"]', '2000');
    await page.fill('input[name="enginePower"]', '150');

    await page.selectOption('select[name="fuelType"]', 'Benzyna');
    await page.selectOption('select[name="gearbox"]', 'Manualna');

    const buffer = Buffer.from('fake-image-content');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'bmw.jpg',
      mimeType: 'image/jpeg',
      buffer: buffer,
    });

    await page.route('**/api/Announcements', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 123, message: 'Created successfully' }),
      });
    });

    await page.click('button:has-text("DODAJ OGŁOSZENIE")', { force: true });

    await expect(page.getByText('Sukces! Ogłoszenie dodane.')).toBeVisible({ timeout: 20000 });
    await page.waitForURL('**/search', { timeout: 15000 });
  });

  test('Walidacja: Próba wysłania pustego formularza', async ({ page }) => {
    await page.getByRole('link', { name: 'Dodaj', exact: false }).click();
    await expect(page.getByRole('heading', { name: 'Dodaj ogłoszenie' })).toBeVisible({
      timeout: 30000,
    });

    await page.selectOption('select', 'Pojazd');

    await page.click('button:has-text("DODAJ OGŁOSZENIE")', { force: true });

    await expect(page.getByText('Tytuł jest wymagany')).toBeVisible();
    await expect(page.getByText('Cena musi być > 0')).toBeVisible();
  });
});
