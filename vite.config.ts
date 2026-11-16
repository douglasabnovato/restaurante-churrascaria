/* Build com Vite + PWA para o GitHub Pages (pasta dist/, publicada pelo GitHub Actions); ícones do manifesto em PNG de 192 e 512 px (um maskable) e SVG da marca, em public/ (#15) */
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sabor & Churrasco - Comanda Digital',
        short_name: 'Sabor&Churrasco',
        description: 'Cardápio e Comanda Digital do Restaurante Sabor & Churrasco',
        theme_color: '#C82323',
        background_color: '#F8F9FA',
        display: 'standalone',
        lang: 'pt-BR',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      }
    })
  ],
  base: '/restaurante-churrascaria/',
  build: {
    outDir: 'dist',
  },
  test: { include: ['tests/unit/**/*.test.ts'] },
})
/* Fim de vite.config.ts */