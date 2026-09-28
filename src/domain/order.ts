/* Regras puras do pedido: total em centavos, validação do checkout, mensagem do WhatsApp e código de reserva */
import type { OrderType, Product } from "../types"

export type Cart = Record<string, number>

/* Valor em centavos (evita 0,1 + 0,2) */
export const toCents = (reais: number) => Math.round(reais * 100)

/* "R$ 1.234,50" */
export const brl = (reais: number) => reais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

/* Soma do carrinho em reais, calculada em centavos; ignora itens inexistentes */
export function cartTotal(cart: Cart, menu: Product[]): number {
  const cents = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = menu.find((i) => i.id === id)
    return item && qty > 0 ? acc + toCents(item.price) * qty : acc
  }, 0)
  return cents / 100
}

/* Valida o checkout; devolve a mensagem de erro ou string vazia */
export function validateCheckout(type: OrderType, table: string, address: string): string {
  if (type === "mesa") {
    const n = Number(table)
    return Number.isInteger(n) && n >= 1 && n <= 999 ? "" : "Informe o número da mesa (1 a 999)."
  }
  return address.trim().length >= 10 ? "" : "Informe o endereço completo (rua, número e bairro)."
}

/* Texto do pedido enviado ao WhatsApp */
export function buildMessage(code: string, cart: Cart, menu: Product[], type: OrderType, table: string, address: string): string {
  const lines = [`*PEDIDO #${code} - SABOR & CHURRASCO*`, "-----------------------------------"]
  for (const [id, qty] of Object.entries(cart)) {
    const item = menu.find((i) => i.id === id)
    if (item && qty > 0) lines.push(`${qty}x ${item.name} - ${brl((toCents(item.price) * qty) / 100)}`)
  }
  lines.push("-----------------------------------", `*Total:* ${brl(cartTotal(cart, menu))}`)
  lines.push(type === "mesa" ? `*Mesa:* ${table}` : `*Delivery:* ${address.trim()}`)
  return lines.join("\n")
}

/* Código usado quando o contador do Firestore não responde: SC + últimos 4 dígitos do horário + MMAAAA (antes era sempre SC0000002026) */
export function fallbackOrderCode(now = new Date()): string {
  const seq = String(now.getTime()).slice(-4)
  return `SC${seq}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}`
}
/* Fim de order.ts */
