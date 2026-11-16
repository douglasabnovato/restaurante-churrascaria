/* Pedido só com teclado, do cardápio até "Pedido enviado!" (#19, critério 8 do MVP). Sem Firebase no build e com o WhatsApp simulado: nenhum pedido real é gravado nem enviado */
import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/* Corta qualquer rede externa e troca o window.open por um objeto que só guarda a URL do WhatsApp */
test.beforeEach(async ({ page, context }) => {
  // Relógio fixo numa terça às 12h em Juiz de Fora: o resultado não depende da hora do CI
  await page.clock.setFixedTime(new Date('2026-11-10T12:00:00-03:00'))
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort())
  await page.addInitScript(() => {
    const w = window as unknown as { __whatsapp?: string }
    window.open = (() => ({
      location: {
        set href(url: string) { w.__whatsapp = url },
        get href() { return w.__whatsapp ?? '' },
      },
    })) as unknown as typeof window.open
  })
})

/* Aperta Tab até o elemento com o nome pedido ganhar o foco */
async function tabAte(page: Page, nome: string | RegExp, maximo = 60) {
  for (let i = 0; i < maximo; i += 1) {
    await page.keyboard.press('Tab')
    const atual = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      return (el?.getAttribute('aria-label') ?? el?.textContent ?? '').trim()
    })
    if (typeof nome === 'string' ? atual === nome : nome.test(atual)) return
  }
  throw new Error(`Tab não chegou a "${nome}"`)
}

/* Violações sérias ou críticas do axe (WCAG 2.1 A e AA), só dentro do seletor */
async function violacoesGraves(page: Page, seletor: string) {
  const { violations } = await new AxeBuilder({ page })
    .include(seletor)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}

const focoDentroDoDialogo = (page: Page) =>
  page.evaluate(() => Boolean(document.querySelector('[role="dialog"]')?.contains(document.activeElement)))

test('envia o pedido de mesa usando só o teclado', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Sabor & Churrasco' })).toBeVisible()
  // Medição (D5): o GoatCounter não carrega em localhost
  await expect(page.locator('script[data-goatcounter]')).toHaveCount(0)

  // Adiciona o primeiro combo pelo teclado
  await tabAte(page, /^Adicionar 1 /)
  await page.keyboard.press('Enter')
  await expect(page.getByText('Subtotal (1 item)')).toBeVisible()

  // Abre o checkout: o foco vai para o diálogo e não sai dele com Tab nem Shift+Tab
  await tabAte(page, 'Avançar')
  await page.keyboard.press('Enter')
  const dialogo = page.getByRole('dialog')
  await expect(dialogo).toBeVisible()
  await expect(dialogo).toBeFocused()
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press('Tab')
    expect(await focoDentroDoDialogo(page)).toBe(true)
  }
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press('Shift+Tab')
    expect(await focoDentroDoDialogo(page)).toBe(true)
  }
  expect(await violacoesGraves(page, '[role="dialog"]')).toEqual([])

  // Esc fecha e devolve o foco ao "Avançar"
  await page.keyboard.press('Escape')
  await expect(dialogo).toBeHidden()
  await expect(page.getByRole('button', { name: 'Avançar' })).toBeFocused()

  // Reabre, escolhe "mesa" com as setas, preenche a mesa e envia
  await page.keyboard.press('Enter')
  await expect(dialogo).toBeFocused()
  await tabAte(page, /Fechar/)
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Tipo de pedido')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(page.getByLabel('Tipo de pedido')).toHaveValue('mesa')
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Número da mesa')).toBeFocused()
  await page.keyboard.type('4')
  await tabAte(page, 'Enviar pedido no WhatsApp')
  await page.keyboard.press('Enter')

  // Confirmação: o foco vai para o título e a mensagem do WhatsApp foi montada
  const titulo = page.getByRole('heading', { name: 'Pedido enviado!' })
  await expect(titulo).toBeVisible()
  await expect(titulo).toBeFocused()
  const whatsapp = await page.evaluate(() => (window as unknown as { __whatsapp?: string }).__whatsapp ?? '')
  expect(whatsapp).toContain('https://wa.me/5500000000000?text=')
  expect(decodeURIComponent(whatsapp)).toContain('*Mesa:* 4')
  expect(await violacoesGraves(page, '[role="dialog"]')).toEqual([])

  // Volta ao cardápio: carrinho vazio, "Avançar" desativado, foco no conteúdo
  await tabAte(page, 'Voltar ao cardápio')
  await page.keyboard.press('Enter')
  await expect(dialogo).toBeHidden()
  await expect(page.getByText('Subtotal (0 itens)')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Avançar' })).toBeDisabled()
  await expect(page.locator('#conteudo')).toBeFocused()
})

test('cardápio inteiro sem violação grave do axe e com o aviso de coleta no rodapé (#12)', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Sabor & Churrasco' })).toBeVisible()
  // Dados reais do cardápio (src/data/menu.ts): espera o primeiro produto antes do axe
  await expect(page.getByRole('button', { name: /^Adicionar 1 / }).first()).toBeVisible()
  const aviso = page.getByTestId('aviso-medicao')
  await aviso.scrollIntoViewIfNeeded()
  await expect(aviso).toBeVisible()
  await expect(aviso).toContainText('sem cookie')
  await expect(aviso.getByRole('link', { name: 'Política do GoatCounter (abre em nova aba)' })).toHaveAttribute('href', 'https://www.goatcounter.com/help/privacy')
  expect(await violacoesGraves(page, 'body')).toEqual([])
  // Sem rolagem horizontal na largura do projeto
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
})

test('às 20h o delivery fica fechado, com aviso lido por leitor de tela (#14)', async ({ page }) => {
  // Terça às 20h em Juiz de Fora: fora do horário do delivery (11h às 15h). Substitui o relógio das 12h do beforeEach
  await page.clock.setFixedTime(new Date('2026-11-10T20:00:00-03:00'))
  await page.goto('./')
  await tabAte(page, /^Adicionar 1 /)
  await page.keyboard.press('Enter')
  await tabAte(page, 'Avançar')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeFocused()
  await expect(page.locator('#delivery-status')).toHaveAttribute('role', 'status')
  await expect(page.locator('#delivery-status')).toContainText('Delivery fechado agora')
  await expect(page.locator('#order-type option[value="delivery"]')).toBeDisabled()
  await expect(page.getByLabel('Tipo de pedido')).toHaveValue('mesa')
  expect(await violacoesGraves(page, '[role="dialog"]')).toEqual([])
})

test('espera: enquanto o registro do pedido carrega, o botão mostra "Enviando…" e fica desativado', async ({ page }) => {
  // Atrasa o módulo que registra o pedido (orders-*.js, carregado só no envio) para a espera aparecer
  let liberar: () => void = () => {}
  const segurado = new Promise<void>((resolve) => { liberar = resolve })
  await page.route(/\/assets\/orders-[^/]+\.js$/, async (route) => { await segurado; await route.continue() })
  await page.goto('./')
  await page.getByRole('button', { name: /^Adicionar 1 / }).first().click()
  await page.getByRole('button', { name: 'Avançar' }).click()
  await page.getByLabel('Tipo de pedido').selectOption('mesa')
  await page.getByLabel('Número da mesa').fill('7')
  await page.getByRole('button', { name: 'Enviar pedido no WhatsApp' }).click()
  const enviando = page.getByRole('button', { name: 'Enviando…' })
  await expect(enviando).toBeVisible()
  await expect(enviando).toBeDisabled()
  liberar()
  await expect(page.getByRole('heading', { name: 'Pedido enviado!' })).toBeVisible()
})

test('mesa vazia mostra o erro sem fechar o diálogo', async ({ page }) => {
  await page.goto('./')
  await tabAte(page, /^Adicionar 1 /)
  await page.keyboard.press('Enter')
  await tabAte(page, 'Avançar')
  await page.keyboard.press('Enter')
  await tabAte(page, 'Enviar pedido no WhatsApp')
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Tipo de pedido')).toHaveValue('mesa')
  await expect(page.getByRole('alert')).toHaveText('Informe o número da mesa (1 a 999).')
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(await focoDentroDoDialogo(page)).toBe(true)
})
/* Fim de pedido-teclado.spec.ts */
