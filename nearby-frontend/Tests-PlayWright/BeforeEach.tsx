import { Page } from '@playwright/test';

export async function performLoginAndSetup(page: Page): Promise<void> {
    await page.goto('http://localhost:8081');
    const loginButton = page.locator('button:has(img[src="/images/user-icon.png"])');
    await loginButton.first().click();
    await page.getByPlaceholder('Username').fill('manu');
    await page.getByPlaceholder('Password').fill('manu');
    await Promise.all([
        page.waitForURL('http://localhost:8081/', { timeout: 8000 }),
        page.getByRole('button', { name: /sign in/i }).click(),
    ]);
    await page.waitForTimeout(1500); // espera um pouco para garantir cookies

    await page.evaluate(() => localStorage.setItem('userID', '1'));
    await page.goto('http://localhost:8081');
    const cookies = await page.context().cookies('http://localhost:8081');
    const token = cookies.find(c => c.name === 'token')?.value;

    if (!token) {
        throw new Error('Token não encontrado nos cookies após login');
    }

    await page.context().setExtraHTTPHeaders({
        Authorization: `Bearer ${token}`,
    });
}
