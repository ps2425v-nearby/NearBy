import { test, expect } from '@playwright/test';
import {performLoginAndSetup} from "../BeforeEach";

test.describe('FilterSearch Component Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Fazer login
        await performLoginAndSetup(page);
        await page.goto('http://localhost:8081/filterSearch');
    });


    test('should select district, municipality, and parish', async ({ page }) => {
        // Verifica se o título "Filtrar Localizações" está presente
        await expect(page.locator('h1:text("Filtrar Localizações")')).toBeVisible();

        // Seleciona um distrito
        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 1 });
        await expect(page.locator('select[aria-label="Selecionar concelho"]')).not.toBeDisabled();

        // Seleciona um concelho
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 1 });
        await expect(page.locator('select[aria-label="Selecionar freguesia"]')).not.toBeDisabled();

        // Seleciona uma freguesia
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 1 });

        // Verifica se o resumo visual reflete as seleções
        await expect(page.locator('text=Distrito:').first()).toContainText(/[^Não selecionado]/);
        await expect(page.locator('text=Concelho:').first()).toContainText(/[^Não selecionado]/);
        await expect(page.locator('text=Freguesia:').first()).toContainText(/[^Não selecionado]/);
    });

    test('should select points of interest and display results', async ({ page }) => {
        // Seleciona filtros geográficos
        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 11 });
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 7 });
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 4 });

        // Confirma que a secção de Pontos de Interesse está visível
        await expect(page.locator('text=Pontos de Interesse')).toBeVisible();

        // Pesquisa e seleciona um ponto de interesse específico
        await page.fill('input[aria-label="Pesquisar pontos de interesse"]', 'Cafés e Pastelarias');
        await page.check('input[type="checkbox"]:near(:text("Cafés e Pastelarias"))');

        // Espera até aparecer o texto com o número de pontos encontrados (ex: "5 pontos encontrados")
        await expect(page.locator('text=/\\d+ pontos encontrados/i')).toBeVisible({ timeout: 10000 });
    });

    test('should reset filters', async ({ page }) => {
        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 1 });
        await page.fill('input[aria-label="Pesquisar pontos de interesse"]', 'Cafés e Pastelarias');
        await page.check('input[type="checkbox"]:near(:text("Cafés e Pastelarias"))');
        await page.click('button:text("Limpar Filtros")');
        await expect(page.locator('select[aria-label="Selecionar distrito"]')).toHaveValue('');
        await expect(page.locator('select[aria-label="Selecionar concelho"]')).toBeDisabled();
        await expect(page.locator('select[aria-label="Selecionar freguesia"]')).toBeDisabled();
        await expect(page.locator('div.bg-blue-200:text("Cafés e Pastelarias")')).not.toBeVisible();
        // Verifica se o VisualSummary não está presente após o reset
        await expect(page.locator('div.bg-blue-100, div.bg-blue-900')).not.toBeVisible();
    });

    test('should navigate to map view when clicking "Ver no Mapa Grande"', async ({ page }) => {
        // Seleciona filtros para ativar o botão do mapa
        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 1 });
        await page.check('input[type="checkbox"]:near(:text("Café"))');

        // Aguarda o botão "Ver no Mapa Grande" aparecer
        await expect(page.locator('button:text("Ver no Mapa Grande")')).toBeVisible({ timeout: 10000 });

        // Clica no botão "Ver no Mapa Grande"
        await page.click('button:text("Ver no Mapa Grande")');

        // Verifica se a navegação ocorreu (URL contém '/')
        await expect(page).toHaveURL(/\/$/);
    });

    test('should display map preview when filters are applied', async ({ page }) => {
        // Seleciona filtros
        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 10 });
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 9 });
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 16 });
        await page.check('input[type="checkbox"]:near(:text("Café"))');
        // Verifica se o mapa está visível
        await page.click('button:text("Ver no Mapa Grande")');
        await expect(page).toHaveURL('http://localhost:8081/');
        const leftColumn = page.locator('#left-column');
        await expect(leftColumn).toBeVisible({ timeout: 20000 });
        const rightColumn = page.locator('#right-column');
        await expect(rightColumn).toBeVisible({ timeout: 20000 });

    });

    test('should show loading state during search', async ({ page }) => {
        // Seleciona filtros
        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 1 });
        await page.check('input[type="checkbox"]:near(:text("Café"))');

        // Verifica o estado de carregamento
        await expect(page.locator('text=A carregar pontos de interesse...')).toBeVisible({ timeout: 5000 });
    });
    test('should show error message if fetch fails', async ({ page }) => {
        // Simula erro (podes mockar o endpoint via route interception se estiveres a usar msw ou interceptação de network)

        await page.selectOption('select[aria-label="Selecionar distrito"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar concelho"]', { index: 1 });
        await page.selectOption('select[aria-label="Selecionar freguesia"]', { index: 1 });

        // Seleciona ponto
        await page.check('input[type="checkbox"]:near(:text("Praias"))');

        // Verifica erro
        await expect(page.locator('text=/Nenhum ponto de interesse encontrado para os critérios selecionados./i')).toBeVisible();
    });

    test('should render with initial empty state', async ({ page }) => {
        await expect(page.locator('select[aria-label="Selecionar distrito"]')).toHaveValue('');
        await expect(page.locator('select[aria-label="Selecionar concelho"]')).toBeDisabled();
        await expect(page.locator('select[aria-label="Selecionar freguesia"]')).toBeDisabled();
        await expect(page.locator('text=Filtrar Localizações')).toBeVisible();
    });


});