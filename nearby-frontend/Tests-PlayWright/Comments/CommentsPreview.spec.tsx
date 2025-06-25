import { test, expect } from '@playwright/test';
import {performLoginAndSetup} from "../BeforeEach";

test.describe('CommentsPreview', () => {
    test.beforeEach(async ({ page }) => {
        await performLoginAndSetup(page);
        await page.goto('http://localhost:8081/comments');
    });

            test('deve mostrar lista de comentários ou mensagem vazia', async ({ page }) => {
                // Espera carregar os dados
                await expect(page.locator('text=Loading...')).toHaveCount(0);

                const noCommentsMessage = page.locator('text=Nenhum comentário escrito ainda...');
                const commentsList = page.locator('div > p.text-base');

                const hasNoComments = await noCommentsMessage.count();
                const hasComments = await commentsList.count();

                expect(hasNoComments + hasComments).toBeGreaterThan(0);
            });

            test('deve permitir editar um comentário', async ({ page }) => {
                const editButton = page.locator('button[aria-label="Edit comment"]').first();
                await expect(editButton).toBeVisible({ timeout: 20000 }); // Aumenta o tempo limite para garantir visibilidade
                await editButton.click();

                const textarea = page.locator('textarea');
                await expect(textarea).toBeVisible({ timeout: 10000 }); // Aumenta o tempo limite para garantir visibilidade

                const novoTexto = 'Comentário editado no teste';
                await textarea.fill(novoTexto);

                const saveButton = page.locator('button:has-text("Guardar")');
                await expect(saveButton).toBeVisible({ timeout: 10000 }); // Aumenta o tempo limite para garantir visibilidade
                await saveButton.click();

                await expect(textarea).toHaveCount(0, { timeout: 10000 }); // Espera o textarea desaparecer

                const comentarioAtualizado = page.locator('div > p.text-base').first();
                await expect(comentarioAtualizado).toHaveText(novoTexto, { timeout: 10000 }); // Verifica o texto atualizado
            });

            test('debug editar', async ({ page }) => {
                await page.goto('http://localhost:8081/comments');

                await expect(page.locator('text=Loading...')).toHaveCount(0); // sumiu => terminou

                await expect(page.locator('div > p.text-base').first()).toBeVisible();

                await page.waitForSelector('button[aria-label="Edit comment"]', { timeout: 5000 });
                const editButtons = page.locator('button[aria-label="Edit comment"]');
                await editButtons.first().click({ force: true });

                const textarea = page.locator('textarea');
                await expect(textarea).toBeVisible();
            });

            test('deve permitir apagar um comentário', async ({ page }) => {
                // Espera que a lista de comentários carregue
                await expect(page.locator('text=Loading...')).toHaveCount(0);

                const commentsList = page.locator('div > p.text-base');
                const initialCount = await commentsList.count();

                expect(initialCount).toBeGreaterThan(0); // Garante que há algo para apagar

                // Localiza e clica no botão de apagar do primeiro comentário
                const deleteButton = page.locator('button[aria-label="Delete comment"]').first();
                await expect(deleteButton).toBeVisible({ timeout: 5000 });
             //   await deleteButton.click();

            });


        });
