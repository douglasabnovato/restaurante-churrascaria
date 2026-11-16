/* Playwright: pedido só com teclado e axe no cardápio e no checkout (#19), no celular (Pixel 7) e no desktop (1280 px). O app não tem tema escuro próprio (nenhum prefers-color-scheme no CSS), então não há projeto escuro. Build sem Firebase (as variáveis VITE_FIREBASE_* vazias), então nenhum pedido é gravado; o WhatsApp é simulado no teste. Porta própria (E2E_PORT) para não colidir com outros servidores locais */
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? 4196)
const semFirebase = Object.fromEntries(
  ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'APP_ID', 'MEASUREMENT_ID'].map((k) => [`VITE_FIREBASE_${k}`, '']),
)

export default defineConfig({
  testDir: './e2e',
  timeout: 120000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    baseURL: `http://localhost:${port}/restaurante-churrascaria/`,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `npx vite build --outDir .build-e2e --emptyOutDir && npx vite preview --outDir .build-e2e --port ${port} --strictPort`,
    url: `http://localhost:${port}/restaurante-churrascaria/`,
    env: { ...semFirebase, VITE_WHATSAPP_NUMBER: '5500000000000' },
    reuseExistingServer: false,
    timeout: 180000,
  },
})
/* Fim de playwright.config.ts */
