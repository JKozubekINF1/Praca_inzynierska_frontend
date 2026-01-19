import { test, expect } from '@playwright/test';

test.describe('Walidacja i Błędy Autentykacji', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('market_cookie_consent', 'true');
    });
  });

  const safeClickSubmit = async (page: any) => {
    await page.locator('button[type="submit"]').evaluate((btn: any) => btn.click());
  };

  const clickCaptcha = async (page: any) => {
    const recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
    const checkbox = recaptchaFrame.getByRole('checkbox');

    await checkbox.click();

    await expect(checkbox).toHaveAttribute('aria-checked', 'true', { timeout: 10000 });
  };

  test('Rejestracja: Blokada zbyt krótkiego hasła', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="username"]', 'shortpassUser');
    await page.fill('input[name="email"]', 'short@test.com');
    await page.fill('input[name="password"]', 'short');
    await page.fill('input[name="confirmPassword"]', 'short');

    await clickCaptcha(page);
    await safeClickSubmit(page);

    await expect(page.getByText('Hasło musi mieć co najmniej 8 znaków.')).toBeVisible();
  });

  test('Rejestracja: Blokada hasła bez znaku specjalnego', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="username"]', 'weakPassUser');
    await page.fill('input[name="email"]', 'weak@test.com');
    await page.fill('input[name="password"]', 'slabefhaslo123');
    await page.fill('input[name="confirmPassword"]', 'slabefhaslo123');

    await clickCaptcha(page);
    await safeClickSubmit(page);

    await expect(
      page.getByText('Hasło musi zawierać co najmniej jedną wielką literę')
    ).toBeVisible();
  });

  test('Rejestracja: Blokada niezgodnych haseł', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="username"]', 'mismatchUser');

    await page.fill('input[name="email"]', 'mismatch@test.com');

    await page.fill('input[name="password"]', 'Haslo123!');
    await page.fill('input[name="confirmPassword"]', 'InneHaslo123!');

    await clickCaptcha(page);
    await safeClickSubmit(page);

    await expect(page.getByText('Hasła nie są zgodne!')).toBeVisible();
  });

  test('Rejestracja: Obsługa błędu serwera (np. zajęty login)', async ({ page }) => {
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 400,
        body: 'Nazwa użytkownika jest już zajęta.',
        contentType: 'text/plain',
      });
    });

    await page.goto('/register');

    await page.fill('input[name="username"]', 'zajetyUser');
    await page.fill('input[name="email"]', 'valid@test.com');
    await page.fill('input[name="password"]', 'Haslo123!');
    await page.fill('input[name="confirmPassword"]', 'Haslo123!');

    await clickCaptcha(page);
    await safeClickSubmit(page);

    await expect(page.getByText('Nazwa użytkownika jest już zajęta.')).toBeVisible();
  });

  test('Logowanie: Walidacja wymaganych pól (HTML5)', async ({ page }) => {
    await page.goto('/login');

    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toHaveAttribute('required', '');

    await safeClickSubmit(page);

    const validationMessage = await usernameInput.evaluate(
      (e) => (e as HTMLInputElement).validationMessage
    );
    expect(validationMessage).not.toBe('');
  });

  test('Logowanie: Błąd backendu (złe hasło)', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Nieprawidłowa nazwa użytkownika lub hasło.' }),
        contentType: 'application/json',
      });
    });

    await page.goto('/login');

    await page.fill('input[name="username"]', 'ktokolwiek');
    await page.fill('input[name="password"]', 'zlehaslo');

    await clickCaptcha(page);
    await safeClickSubmit(page);

    await expect(page.getByText('Nieprawidłowa nazwa użytkownika lub hasło.')).toBeVisible();
  });
});
