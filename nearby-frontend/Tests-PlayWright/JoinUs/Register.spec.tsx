import { test, expect } from '@playwright/test';

test('exibe a URL atual após clique em registrar', async ({ page }) => {
    await page.goto('http://localhost:8081/register');

    // Preenche os campos...
    await page.locator('input#email').fill('test@example.com');
    await page.getByLabel('Username').fill('testUser');
    await page.getByLabel('Password').fill('Test@123');

    // Clica no botão de registrar
    await page.getByRole('button', { name: 'Register' }).click();

    // Espera um pouco (para garantir que a navegação tenha tempo)
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL('http://localhost:8081/');
});
