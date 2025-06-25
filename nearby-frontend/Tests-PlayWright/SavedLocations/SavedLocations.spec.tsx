import { test, expect } from '@playwright/test';
import {performLoginAndSetup} from "../BeforeEach";

test.describe('SavedLocations', () => {

    test.beforeEach(async ({ page }) => {
        await performLoginAndSetup(page);
        await page.goto('http://localhost:8081/savedLocations');
    });

    test('deve mostrar lista de localizações guardadas', async ({page}) => {
        await page.goto('http://localhost:8081/savedLocations', { waitUntil: 'networkidle' });
        await page.goto('http://localhost:8081/savedLocations');

// Aguarda até o loader sumir
        await expect(page.getByText("Carregando localizações...")).toBeHidden({ timeout: 15000 });

// Agora espera pelo título
        await expect(page.getByText("📍 Localizações Guardadas")).toBeVisible({ timeout: 5000 });

        // Aguarda o carregamento da secção
        await page.getByText('📍 Localizações Guardadas').waitFor({timeout: 10000});
        // Depois espera pela lista
        const lista = page.locator('ul > li');
        await expect(lista.first()).toBeVisible();

    });
    test('deve clicar no botão "Comparar" se estiver disponível e mostrar cards', async ({ page }) => {
        await page.goto('http://localhost:8081/savedLocations');
        await page.getByText('📍 Localizações Guardadas').waitFor();

        const botaoComparar = page.getByRole('button', { name: /Comparar/i });        await expect(botaoComparar.first()).toBeVisible();
        await botaoComparar.first().click();

        // Espera o container dos cards de comparação aparecer
        const comparisonContainer = page.locator('div.flex.flex-col.lg\\:flex-row.gap-4.w-full');
        await expect(comparisonContainer).toBeVisible();

        // Verifica se tem pelo menos 1 card dentro
        await expect(comparisonContainer.locator('div')).toHaveCount(20); // quantidade de divs existentes na localização guardada
    });

    test('deve eliminar uma localização se houver botão "Eliminar"', async ({ page }) => {
        const botaoEliminar = page.getByRole('button', { name: /Eliminar/i });

        const count = await botaoEliminar.count();
        test.skip(!count, 'Nenhuma localização para eliminar');

        await botaoEliminar.first().click();

        // Espera a notificação de sucesso
        await expect(page.getByText(/eliminada com sucesso/i)).toBeVisible();
    });

    test('botão "Comparar" deve estar desativado após 3 seleções', async ({ page }) => {
        const botaoComparar = page.getByRole('button', { name: /Comparar/i });

        const count = await botaoComparar.count();
        test.skip(count < 4, 'Não há localizações suficientes para testar limite de comparação');

        // Seleciona 3 localizações para comparar
        for (let i = 0; i < 3; i++) {
            await botaoComparar.nth(i).click();
            await page.waitForTimeout(300);
        }

        // Verifica se o quarto botão está desativado
        await expect(botaoComparar.nth(3)).toBeDisabled();
    });


});
