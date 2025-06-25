import { test, expect } from '@playwright/test';
import {performLoginAndSetup} from "../BeforeEach";


test.describe('Home Component Map Tests', () => {
    test.beforeEach(async ({ page }) => {
        await performLoginAndSetup(page);
    });

    const fireMapClickEvent = async (page: any, lat: number, lng: number) => {
        // Clica no botão para ativar o modo desenho do marcador
        const drawMarkerButton = page.locator('.leaflet-draw-draw-marker');
        await expect(drawMarkerButton).toBeVisible({ timeout: 5000 });
        await drawMarkerButton.click();

        // Dispara o clique no mapa nas coordenadas lat/lng
        await page.evaluate(
            ({ lat, lng }: { lat: number; lng: number }) => {
                const mapElement = document.querySelector('.leaflet-container');
                if (!mapElement) throw new Error('Mapa não encontrado');
                const map = (mapElement as any)._leaflet_map;
                if (!map) throw new Error('Instância do mapa não encontrada');
                const latlng = window.L.latLng(lat, lng);
                const containerPoint = map.latLngToContainerPoint(latlng);
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    clientX: containerPoint.x,
                    clientY: containerPoint.y
                });
                mapElement.dispatchEvent(event);
                map.fire('click', { latlng, originalEvent: event });
            },
            { lat, lng }
        );
    };

    test('should display initial message when no marker is set', async ({ page }) => {
        await expect(page.getByText('Clique no mapa para selecionar uma localização')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 10000 });
    });

    test('set a marker on the map and get real data', async ({ page }) => {

        await fireMapClickEvent(page, 38.7489, -9.1004);
        const carregando = page.getByText('Carregando informações...');
        await expect(carregando).toBeVisible({ timeout: 10000 });
        const semDados = page.getByText('Nenhuma informação disponível para esta localização.');
        await expect(semDados).not.toBeVisible();
        const infoLocal = page.getByRole('heading', { name: /informações do local/i });
        await expect(infoLocal).toBeVisible({ timeout: 10000 });
    });
    test('should render leftColumn and rightColumn with data', async ({ page }) => {
        await fireMapClickEvent(page, 38.7489, -9.1004);
        const leftColumn = page.locator('#left-column');
        await expect(leftColumn).toBeVisible({ timeout: 10000 });
        const rightColumn = page.locator('#right-column');
        await expect(rightColumn).toBeVisible({ timeout: 10000 });
    })

    test('clicking save button triggers onSave callback', async ({ page }) => {

        await fireMapClickEvent(page, 38.7595, -9.1004);
        const leftColumn = page.locator('#left-column');
        await expect(leftColumn).toBeVisible({ timeout: 10000 });
       const saveButton = page.locator('#save-location-button');
        await expect(saveButton).toBeVisible();
        await saveButton.click();

    });

    test('should write a comment when clicking on comment button', async ({ page }) => {

        await fireMapClickEvent(page, 38.7598, -9.1004);
        const leftColumn = page.locator('#left-column');
        await expect(leftColumn).toBeVisible({ timeout: 15000 });
        const saveButton = page.locator('#save-location-button');
        await expect(saveButton).toBeVisible();
        await saveButton.click();
        const commentButton = page.locator('#addcomment');
        await expect(commentButton).toBeVisible();
        await commentButton.click();
        const commentInput = page.locator('#comments-popup');
        await page.waitForTimeout(1000);
        await expect(commentInput).toBeVisible({ timeout: 2000 });
        const commentTextArea = page.locator('textarea');
        await commentTextArea.fill('Test comment');
        await commentTextArea.press('Enter');
        const commentList = page.locator('#comments-popup-submit-button');
        await expect(commentList).toBeVisible({ timeout: 10000 });
        await commentList.click();
        // wait to redirect
        await page.waitForTimeout(1000);
        // check if is in comments page
        await expect(page).toHaveURL('http://localhost:8081/comments');

    })
    test('Shows the meteorology on the right column', async ({ page }) => {
        await fireMapClickEvent(page, 38.7599, -9.1005);

        const rightColumn = page.locator('#right-column');
        await expect(rightColumn).toBeVisible({ timeout: 10000 });

       const metereology = rightColumn.locator('#weather-section');
       await expect(metereology).toBeVisible({ timeout: 10000 });

    })


});