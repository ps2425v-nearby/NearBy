import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './Tests-PlayWright',
    testMatch: '**/*.spec.ts?(x)',
    testIgnore: ['**/*.test.ts?(x)', '**/Tests-RTL/**'],


    timeout: 30 * 1000,
    use: {
        baseURL: 'http://localhost:8080',
        headless: false, // Defina como true para rodar sem abrir o navegador
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
});
