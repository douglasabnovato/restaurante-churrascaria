/* Vitest para as regras do Firestore (ambiente Node + emulador) */
import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { include: ['tests/rules/**/*.test.ts'], environment: 'node', testTimeout: 15000 } })
/* Fim de vitest.rules.config.ts */
