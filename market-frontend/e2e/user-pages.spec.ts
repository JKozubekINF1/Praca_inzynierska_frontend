import { test, expect } from '@playwright/test';

test.describe('Strony Użytkownika (Chronione)', () => {
  test.setTimeout(60000);

  const user = { username: 'Kozub', password: 'Qwerty123!' };

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('market_cookie_consent', 'true'));
    await page.goto('/login');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);

    const frame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
    await frame.getByRole('checkbox').click();
    await expect(frame.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true', {
      timeout: 15000,
    });

    await page.click('button[type="submit"]', { force: true });
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible({ timeout: 20000 });
  });

  test('Profil: Wyświetla dane i pozwala wejść w edycję', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Mój Profil' })).toBeVisible();
    const editButton = page.getByRole('button', { name: 'Edytuj dane' });
    await expect(editButton).toBeVisible();
    await editButton.click();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('Ulubione: Wyświetla listę', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.getByRole('heading', { name: 'Obserwowane ogłoszenia' })).toBeVisible();
    const emptyState = page.getByText('Nie masz jeszcze obserwowanych ogłoszeń');
    const hasItems = page.locator('.grid >> div').first();

    await expect(emptyState.or(hasItems)).toBeVisible();
  });

  test('Wiadomości: Wyświetla listę czatów', async ({ page }) => {
    await page.goto('/messages');
    await expect(page.getByRole('heading', { name: 'Moje Wiadomości' })).toBeVisible();

    const chatItem = page.locator('main >> h3').first();

    await expect(chatItem).toBeVisible({ timeout: 10000 });
  });
});
