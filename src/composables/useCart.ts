/* Carrinho: quantidades, total, envio ao Firestore (quando disponível) e ao WhatsApp */
import { ref, computed } from "vue"
import type { OrderType } from "../types"
import { itemsData, DEFAULT_CHEF_IMAGE } from "../data/menu"
import { buildMessage, cartTotal, fallbackOrderCode } from "../domain/order"
import { WHATSAPP_NUMBER } from "../config"

export { itemsData, DEFAULT_CHEF_IMAGE }

export function useCart() {
  const cart = ref<Record<string, number>>({})
  const isModalOpen = ref(false)
  const isOrderSubmitted = ref(false)
  const sending = ref(false)
  const lastCode = ref("")

  /* Soma ou subtrai uma unidade (nunca abaixo de zero) */
  const updateQty = (id: string, change: number) => {
    const updated = Math.max(0, (cart.value[id] || 0) + change)
    if (updated === 0) delete cart.value[id]
    else cart.value[id] = updated
  }

  const subtotal = computed(() => cartTotal(cart.value, itemsData))
  const totalItems = computed(() => Object.values(cart.value).reduce((acc, qty) => acc + qty, 0))

  /* Gera o código, registra o pedido e abre o WhatsApp (o registro não bloqueia o envio) */
  const sendToWhatsApp = async (type: OrderType, tableNum = "", address = "") => {
    if (sending.value) return
    sending.value = true
    const whatsappWindow = window.open("", "_blank")
    let orderCode = fallbackOrderCode()
    try {
      const orders = await import("../services/orders")
      try {
        orderCode = await orders.generateOrderCode()
      } catch (err) {
        console.warn("Contador de pedidos indisponível; usando código provisório.", err)
      }
      await orders.saveOrder({ code: orderCode, type, table: String(tableNum), address, subtotal: subtotal.value, items: cart.value })
    } catch (err) {
      console.warn("Pedido não registrado no painel; seguirá só pelo WhatsApp.", err)
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(orderCode, cart.value, itemsData, type, tableNum, address))}`
    if (whatsappWindow) whatsappWindow.location.href = url
    else window.location.href = url
    lastCode.value = orderCode
    isOrderSubmitted.value = true
    sending.value = false
  }

  /* Limpa tudo e volta ao topo */
  const resetAppAndReturn = () => {
    cart.value = {}
    isModalOpen.value = false
    isOrderSubmitted.value = false
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return { cart, subtotal, totalItems, isModalOpen, isOrderSubmitted, sending, lastCode, updateQty, sendToWhatsApp, resetAppAndReturn }
}
/* Fim de useCart.ts */
