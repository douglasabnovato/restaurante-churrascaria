<!-- Finalização do pedido em diálogo acessível: valida mesa/endereço, fecha com Esc, prende o foco enquanto aberto, devolve o foco ao fechar e mostra o código do pedido (#19) -->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/60 flex justify-center items-end z-40" @keydown.esc="!isSubmitted && $emit('close')" @keydown.tab="trapFocus">
    <div ref="dialogEl" role="dialog" aria-modal="true" aria-labelledby="checkout-title" tabindex="-1"
      class="bg-surface w-full max-w-[480px] rounded-t-2xl p-6 animate-slide-up outline-none">
      <form v-if="!isSubmitted" novalidate @submit.prevent="handleSubmit">
        <div class="flex justify-between items-center mb-5 pb-2.5 border-b border-slate-200">
          <h2 id="checkout-title" class="text-base font-extrabold text-primary-dark">Finalizar pedido</h2>
          <button type="button" aria-label="Fechar" @click="$emit('close')" class="text-xl font-bold text-slate-600 hover:text-dark w-9 h-9">✕</button>
        </div>

        <div class="mb-3.5">
          <label for="order-type" class="block text-xs font-bold text-dark mb-1.5">Tipo de pedido</label>
          <select id="order-type" v-model="orderType" :aria-describedby="deliveryOk ? undefined : 'delivery-status'" class="w-full p-3 border border-slate-400 rounded-lg text-sm bg-body">
            <option value="mesa">Consumo no local (mesa)</option>
            <option value="delivery" :disabled="!deliveryOk">Delivery (entrega em casa){{ deliveryOk ? '' : ' · fechado agora' }}</option>
          </select>
          <p v-if="!deliveryOk" id="delivery-status" role="status" class="text-xs text-amber-900 bg-amber-100 rounded-md p-2 mt-1.5">
            Delivery fechado agora. Horário: {{ textoDelivery().toLowerCase() }}.
          </p>
        </div>

        <div v-if="orderType === 'mesa'" class="mb-3.5">
          <label for="order-table" class="block text-xs font-bold text-dark mb-1.5">Número da mesa</label>
          <input id="order-table" v-model="tableNum" type="number" inputmode="numeric" min="1" max="999" placeholder="Ex.: 4"
            :aria-invalid="Boolean(error)" aria-describedby="checkout-error" class="w-full p-3 border border-slate-400 rounded-lg text-sm bg-body" />
        </div>
        <div v-else class="mb-3.5">
          <label for="order-address" class="block text-xs font-bold text-dark mb-1.5">Endereço completo de entrega</label>
          <input id="order-address" v-model="address" type="text" autocomplete="street-address" placeholder="Rua, número, bairro e referência"
            :aria-invalid="Boolean(error)" aria-describedby="checkout-error" class="w-full p-3 border border-slate-400 rounded-lg text-sm bg-body" />
          <p class="text-[0.7rem] text-slate-600 mt-1">O endereço é usado só para a entrega deste pedido.</p>
        </div>

        <div class="mb-3.5">
          <label for="order-note" class="block text-xs font-bold text-dark mb-1.5">Observação (opcional)</label>
          <textarea id="order-note" v-model="note" rows="2" :maxlength="NOTE_MAX" placeholder="Ex.: picanha ao ponto, sem cebola"
            aria-describedby="order-note-help" class="w-full p-3 border border-slate-400 rounded-lg text-sm bg-body"></textarea>
          <p id="order-note-help" class="text-[0.7rem] text-slate-600 mt-1">Vai na mensagem do WhatsApp. Até {{ NOTE_MAX }} caracteres.</p>
        </div>

        <p id="checkout-error" role="alert" class="text-sm text-red-700 min-h-[1.25rem]">{{ error }}</p>

        <button type="submit" :disabled="sending"
          class="w-full bg-whatsapp text-white font-extrabold text-base py-3.5 rounded-xl cursor-pointer mt-2.5 shadow-lg disabled:opacity-70">
          {{ sending ? 'Enviando…' : 'Enviar pedido no WhatsApp' }}
        </button>
      </form>

      <div v-else class="text-center py-3" role="status">
        <div class="text-5xl text-whatsapp mb-2.5" aria-hidden="true">✓</div>
        <h2 id="checkout-title" ref="successTitle" tabindex="-1" class="text-lg font-extrabold text-primary-dark mb-2 outline-none">Pedido enviado!</h2>
        <p class="text-sm text-slate-600 mb-2">Código do pedido: <strong>#{{ orderCode }}</strong></p>
        <p class="text-xs text-slate-600 mb-6 leading-relaxed">Confirme o envio da mensagem no WhatsApp para concluir.</p>
        <button type="button" @click="$emit('reset')" class="w-full bg-primary text-white font-extrabold text-sm py-3 px-5 rounded-lg cursor-pointer">
          Voltar ao cardápio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { OrderType } from '../types'
import { NOTE_MAX, validateCheckout } from '../domain/order'
import { deliveryAberto, textoDelivery } from '../domain/hours'

const props = defineProps<{ isOpen: boolean; isSubmitted: boolean; sending?: boolean; orderCode?: string }>()
const emit = defineEmits(['close', 'send', 'reset'])

const orderType = ref<OrderType>('mesa')
const tableNum = ref('')
const address = ref('')
const note = ref('')
const error = ref('')
const dialogEl = ref<HTMLElement | null>(null)
const successTitle = ref<HTMLElement | null>(null)
/* Elemento que tinha o foco antes de abrir (o botão "Avançar") */
let returnFocusTo: HTMLElement | null = null
/* Conferido a cada abertura e no envio (#14) */
const deliveryOk = ref(deliveryAberto())

/* Leva o foco para o diálogo ao abrir e devolve ao fechar */
watch(() => props.isOpen, async (open) => {
  if (!open) {
    await nextTick()
    const target = returnFocusTo && returnFocusTo.isConnected && !(returnFocusTo as HTMLButtonElement).disabled
      ? returnFocusTo
      : document.getElementById('conteudo')
    target?.focus()
    returnFocusTo = null
    return
  }
  returnFocusTo = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null
  error.value = ''
  deliveryOk.value = deliveryAberto()
  if (!deliveryOk.value && orderType.value === 'delivery') orderType.value = 'mesa'
  await nextTick()
  dialogEl.value?.focus()
})

/* Com o pedido enviado, o formulário some: o foco vai para o título da confirmação */
watch(() => props.isSubmitted, async (submitted) => {
  if (!submitted) return
  await nextTick()
  successTitle.value?.focus()
})

/* Mantém o Tab dentro do diálogo (aria-modal): do último volta ao primeiro e vice-versa */
const FOCUSABLE = 'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
const trapFocus = (event: KeyboardEvent) => {
  const dialog = dialogEl.value
  if (!dialog) return
  const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0)
  if (items.length === 0) { event.preventDefault(); dialog.focus(); return }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement
  const outside = !dialog.contains(active)
  if (event.shiftKey && (active === first || active === dialog || outside)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault()
    first.focus()
  }
}

/* Valida e envia */
const handleSubmit = () => {
  deliveryOk.value = deliveryAberto()
  error.value = orderType.value === 'delivery' && !deliveryOk.value
    ? `O delivery está fechado agora (horário: ${textoDelivery().toLowerCase()}). Escolha consumo no local.`
    : validateCheckout(orderType.value, String(tableNum.value), address.value)
  if (error.value) return
  emit('send', orderType.value, String(tableNum.value), address.value, note.value)
}
</script>
<!-- Fim de CheckoutModal.vue -->
