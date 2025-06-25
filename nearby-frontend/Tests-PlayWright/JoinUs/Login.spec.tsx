import { test, expect } from '@playwright/test';

const validUser = {
    username: 'pai',
    password: 'pai'
};

test('login com credenciais válidas', async ({ page }) => {
    await page.goto('http://localhost:8081');

    // Clica no botão de login pelo seletor do ícone
    const loginButton = page.locator('button:has(img[src="/images/user-icon.png"])');
    await loginButton.first().click();

    // Preenche o formulário dentro do modal
    await page.getByPlaceholder('Username').fill(validUser.username);
    await page.getByPlaceholder('Password').fill(validUser.password);

    // Submete e aguarda redirecionamento
    await Promise.all([
        page.waitForURL('http://localhost:8081/', { timeout: 8000 }),
        page.getByRole('button', { name: /sign in/i }).click() // este é o botão *dentro do modal*
    ]);

    // Notificação (opcional)
    try {
        await expect(page.getByText(/Logged in successfully!/i)).toBeVisible({ timeout: 2000 });
    } catch {
        console.warn('Notificação desapareceu rápido demais para capturar');
    }

    // Verifica cookie salvo
    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(c => c.name === 'token');
    expect(tokenCookie).toBeTruthy();

    // Verifica se o localStorage salvou o username
    const storedUsername = await page.evaluate(() => localStorage.getItem('username'));
    expect(storedUsername).toBe(validUser.username);
});
