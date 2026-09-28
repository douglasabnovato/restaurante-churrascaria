/* Testes das regras do pedido: total em centavos, validação, mensagem e código provisório */
import { describe, it, expect } from 'vitest'
import { brl, buildMessage, cartTotal, fallbackOrderCode, validateCheckout } from '../../src/domain/order'
import type { Product } from '../../src/types'

const menu: Product[] = [
  { id: 'a', name: 'Picanha', desc: '', price: 38, cat: 'special', img: '' },
  { id: 'b', name: 'Suco', desc: '', price: 0.1, cat: 'drink', img: '' },
  { id: 'c', name: 'Água', desc: '', price: 0.2, cat: 'drink', img: '' },
]

describe('pedido', () => {
  it('soma em centavos e ignora itens inexistentes', () => {
    expect(cartTotal({ b: 1, c: 1 }, menu)).toBe(0.3)
    expect(cartTotal({ a: 2, x: 5 }, menu)).toBe(76)
  })
  it('valida mesa e endereço', () => {
    expect(validateCheckout('mesa', '', '')).toMatch(/mesa/)
    expect(validateCheckout('mesa', '1000', '')).toMatch(/mesa/)
    expect(validateCheckout('mesa', '4', '')).toBe('')
    expect(validateCheckout('delivery', '', 'Rua A')).toMatch(/endereço/)
    expect(validateCheckout('delivery', '', 'Rua A, 10 - Centro')).toBe('')
  })
  it('mensagem com código, itens, total em reais e destino', () => {
    const msg = buildMessage('SC0001092026', { a: 1, b: 2 }, menu, 'delivery', '', ' Rua A, 10 - Centro ')
    expect(msg).toContain('*PEDIDO #SC0001092026')
    expect(msg).toContain('2x Suco - R$')
    expect(msg).toContain(`*Total:* ${brl(38.2)}`)
    expect(msg.endsWith('*Delivery:* Rua A, 10 - Centro')).toBe(true)
  })
  it('código provisório não é mais fixo', () => {
    expect(fallbackOrderCode(new Date(2026, 8, 27, 12, 0, 1))).toMatch(/^SC\d{4}092026$/)
    expect(fallbackOrderCode(new Date(1))).not.toBe(fallbackOrderCode(new Date(2)))
  })
})
/* Fim de order.test.ts */
