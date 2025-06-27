import { test, expect } from '@playwright/test';
/*
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

 */

test('exibe a URL atual após clique em registrar (sem tocar na BD)', async ({ page }) => {
    // 1) Intercepta a chamada de registo
    await page.route('**/api/register', async (route) => {
        await route.fulfill({
            status: 201,                              // ou 200 se for o caso
            contentType: 'application/json',
            body: JSON.stringify({
                id: 999,                // qualquer id “fake”
                username: 'testUser',
                email: 'test@example.com',
            }),
        });
    });

    // 2) Agora pode navegar normalmente
    await page.goto('http://localhost:8081/register');

    // 3) Preenchimento do formulário
    await page.locator('input#email').fill('test@example.com');
    await page.getByLabel('Username').fill('testUser');
    await page.getByLabel('Password').fill('Test@123');

    // 4) Clica no botão
    await page.getByRole('button', { name: 'Register' }).click();

    // 5) Espera a navegação da SPA (ou `page.waitForURL('**/')`, se preferir)
    await page.waitForURL('http://localhost:8081/');
    await expect(page).toHaveURL('http://localhost:8081/');
});

