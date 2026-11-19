/* Painel da equipe no navegador com os emuladores de Auth e Firestore (#31): login, pedido que chega sem recarregar, observação (#13), troca de status e axe. Roda com `npm run test:e2e:painel`; dados fictícios, só nos emuladores locais */
import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PROJETO = 'demo-sabor'
const FIRESTORE = 'http://127.0.0.1:8080'
const AUTH = 'http://127.0.0.1:9099'
/* Conta fictícia da equipe, criada a cada teste só no emulador de Auth */
const EQUIPE = { email: 'equipe@empresa.test', senha: 'emulador-123456' }

/* Zera os emuladores e cria a conta da equipe com o documento staff/{uid} (as regras exigem esse documento) */
async function prepararEmuladores() {
  await fetch(`${FIRESTORE}/emulator/v1/projects/${PROJETO}/databases/(default)/documents`, { method: 'DELETE' })
  await fetch(`${AUTH}/emulator/v1/projects/${PROJETO}/accounts`, { method: 'DELETE' })
  const conta = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EQUIPE.email, password: EQUIPE.senha, returnSecureToken: true }),
  })
  expect(conta.ok).toBe(true)
  const { localId } = (await conta.json()) as { localId: string }
  // "Bearer owner" ignora as regras no emulador: só para preparar os dados do teste
  const staff = await fetch(`${FIRESTORE}/v1/projects/${PROJETO}/databases/(default)/documents/staff/${localId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({ fields: { name: { stringValue: 'Caixa' } } }),
  })
  expect(staff.ok).toBe(true)
}

/* Corta a rede fora da máquina e troca o window.open por um objeto que só guarda a URL do WhatsApp */
async function isolar(page: Page) {
  await page.context().route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) => route.abort())
  await page.addInitScript(() => {
    const w = window as unknown as { __whatsapp?: string }
    window.open = (() => ({
      location: {
        set href(url: string) { w.__whatsapp = url },
        get href() { return w.__whatsapp ?? '' },
      },
    })) as unknown as typeof window.open
  })
}

/* Violações sérias ou críticas do axe (WCAG 2.1 A e AA) */
async function violacoesGraves(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}

test.beforeEach(prepararEmuladores)

test('a equipe entra, vê o pedido chegar sem recarregar e muda o status', async ({ browser }) => {
  // Equipe: abre o painel e entra
  const equipe = await (await browser.newContext()).newPage()
  await isolar(equipe)
  await equipe.goto('./#/painel')
  await expect(equipe.getByRole('heading', { name: 'Entrar no painel' })).toBeVisible()
  expect(await violacoesGraves(equipe)).toEqual([])
  await equipe.getByLabel('E-mail').fill(EQUIPE.email)
  await equipe.getByLabel('Senha').fill(EQUIPE.senha)
  await equipe.getByRole('button', { name: 'Entrar' }).click()
  await expect(equipe.getByText('Nenhum pedido registrado até o momento.')).toBeVisible()

  // Cliente: monta e envia um pedido de mesa com observação, em outra sessão
  const cliente = await (await browser.newContext()).newPage()
  await isolar(cliente)
  // Relógio fixo em 10/11/2026, 12h, em Juiz de Fora: o código do pedido termina em 112026
  await cliente.clock.setFixedTime(new Date('2026-11-10T12:00:00-03:00'))
  await cliente.goto('./')
  await cliente.getByRole('button', { name: /^Adicionar 1 / }).first().click()
  await cliente.getByRole('button', { name: 'Avançar' }).click()
  await cliente.getByLabel('Tipo de pedido').selectOption('mesa')
  await cliente.getByLabel('Número da mesa').fill('5')
  await cliente.getByLabel('Observação (opcional)').fill('Picanha ao ponto, sem cebola')
  await cliente.getByRole('button', { name: 'Enviar pedido no WhatsApp' }).click()
  await expect(cliente.getByRole('heading', { name: 'Pedido enviado!' })).toBeVisible()
  // O contador do emulador começa em 1: o código não é o provisório
  await expect(cliente.getByText('#SC0001112026')).toBeVisible()

  // Equipe: o pedido aparece sem recarregar (onSnapshot)
  const linha = equipe.locator('tbody tr').filter({ hasText: '#SC0001112026' })
  await expect(linha).toBeVisible()
  await expect(linha).toContainText('Mesa 5')
  await expect(linha).toContainText('Pendente')
  expect(await violacoesGraves(equipe)).toEqual([])

  // Detalhe com a observação (#13) e troca do status para "Em Preparo"
  await linha.getByRole('button', { name: 'Ver Detalhes' }).click()
  await expect(equipe.getByTestId('order-note')).toHaveText('Picanha ao ponto, sem cebola')
  await equipe.getByRole('button', { name: 'Em Preparo' }).click()
  await equipe.getByRole('button', { name: 'Fechar' }).last().click()
  await expect(linha).toContainText('Em Preparo')
  await expect(equipe.getByRole('alert')).toHaveCount(0)
})

test('senha errada mostra o erro e não abre o painel', async ({ page }) => {
  await isolar(page)
  await page.goto('./#/painel')
  await page.getByLabel('E-mail').fill(EQUIPE.email)
  await page.getByLabel('Senha').fill('senha-errada')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByRole('alert')).toHaveText('E-mail ou senha inválidos.')
  await expect(page.getByRole('heading', { name: 'Dashboard de Pedidos' })).toHaveCount(0)
})
/* Fim de painel.spec.ts */
