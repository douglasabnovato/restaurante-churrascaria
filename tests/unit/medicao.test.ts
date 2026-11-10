/* Medição (D5): o GoatCounter não carrega no dev nem nos testes, e o evento só sai com o site em produção */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ENDERECO_MEDICAO, carregarMedicao, medicaoAtiva, registrarEvento, reiniciarMedicao } from '../../src/services/medicao'

/* Documento mínimo, sem jsdom: guarda os scripts inseridos no head */
function documentoFalso() {
  const scripts: Array<{ async: boolean; src: string; attrs: Record<string, string> }> = []
  return {
    scripts,
    doc: {
      querySelector: () => (scripts.length ? scripts[0] : null),
      createElement: () => {
        const s = { async: false, src: '', attrs: {} as Record<string, string>, setAttribute(k: string, v: string) { this.attrs[k] = v } }
        return s
      },
      head: { appendChild: (s: (typeof scripts)[number]) => scripts.push(s) },
    } as unknown as Document,
  }
}

afterEach(() => reiniciarMedicao())

describe('medição de uso', () => {
  it('não carrega nos testes (sem build de produção)', () => {
    const { doc, scripts } = documentoFalso()
    expect(medicaoAtiva()).toBe(false)
    expect(carregarMedicao(undefined, undefined, doc)).toBe(false)
    expect(scripts).toHaveLength(0)
  })

  it('não carrega no próprio computador, nem com build de produção', () => {
    for (const host of ['localhost', '127.0.0.1', '[::1]', '']) expect(medicaoAtiva(true, host)).toBe(false)
  })

  it('carrega uma vez no site publicado, com o código do portfólio', () => {
    const { doc, scripts } = documentoFalso()
    expect(carregarMedicao(true, 'douglasabnovato.github.io', doc)).toBe(true)
    expect(carregarMedicao(true, 'douglasabnovato.github.io', doc)).toBe(false)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].attrs['data-goatcounter']).toBe(ENDERECO_MEDICAO)
  })

  it('conta o pedido enviado como evento, sem dado pessoal, só depois de carregar', () => {
    const count = vi.fn()
    const janela = { goatcounter: { count } }
    registrarEvento('enviar-pedido', janela)
    expect(count).not.toHaveBeenCalled()
    carregarMedicao(true, 'douglasabnovato.github.io', documentoFalso().doc)
    registrarEvento('enviar-pedido', janela)
    expect(count).toHaveBeenCalledWith({ path: 'enviar-pedido', title: 'enviar-pedido', event: true })
  })
})
/* Fim de medicao.test.ts */
