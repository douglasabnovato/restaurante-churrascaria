/* Playwright do painel da equipe com os emuladores de Auth e Firestore (#31). Roda dentro de `npm run test:e2e:painel`, que sobe os emuladores (firebase emulators:exec, projeto demo-sabor). O build aponta para os emuladores (VITE_FIREBASE_EMULATORS=true) com uma configuração fictícia: nada sai da máquina. Porta própria (E2E_PAINEL_PORT) */
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PAINEL_PORT ?? 4197)
const emulador = {
  VITE_FIREBASE_API_KEY: 'demo-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'demo-sabor.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'demo-sabor',
  VITE_FIREBASE_STORAGE_BUCKET: '',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '',
  VITE_FIREBASE_APP_ID: 'demo-app',
  VITE_FIREBASE_MEASUREMENT_ID: '',
  VITE_FIREBASE_EMULATORS: 'true',
  VITE_WHATSAPP_NUMBER: '5500000000000',
}

export default defineConfig({
  testDir: './e2e-painel',
  timeout: 120000,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
    baseURL: `http://localhost:${port}/restaurante-churrascaria/`,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx vite build --outDir .build-e2e-painel --emptyOutDir && npx vite preview --outDir .build-e2e-painel --port ${port} --strictPort`,
    url: `http://localhost:${port}/restaurante-churrascaria/`,
    env: emulador,
    reuseExistingServer: false,
    timeout: 180000,
  },
})
/* Fim de playwright.painel.config.ts */
