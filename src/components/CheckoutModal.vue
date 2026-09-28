<!-- Finalização do pedido em diálogo acessível: valida mesa/endereço, fecha com Esc e mostra o código do pedido -->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/60 flex justify-center items-end z-40" @keydown.esc="!isSubmitted && $emit('close')">
    <div ref="dialogEl" role="dialog" aria-modal="true" aria-labelledby="checkout-title" tabindex="-1"
      class="bg-surface w-full max-w-[480px] rounded-t-2xl p-6 animate-slide-up outline-none">
      <form v-if="!isSubmitted" novalidate @submit.prevent="handleSubmit">
        <div class="flex justify-between items-center mb-5 pb-2.5 border-b border-slate-200">
          <h2 id="checkout-title" class="text-base font-extrabold text-primary-dark">Finalizar pedido</h2>
          <button type="button" aria-label="Fechar" @click="$emit('close')" class="text-xl font-bold text-slate-600 hover:text-dark w-9 h-9">✕</button>
        </div>

        <div class="mb-3.5">
          <label for="order-type" class="block text-xs font-bold text-dark mb-1.5">Tipo de pedido</label>
          <select id="order-type" v-model="orderType" class="w-full p-3 border border-slate-400 rounded-lg text-sm bg-body">
            <option value="mesa">Consumo no local (mesa)</option>
            <option value="delivery">Delivery (entrega em casa)</option>
          </select>
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

        <p id="checkout-error" role="alert" class="text-sm text-red-700 min-h-[1.25rem]">{{ error }}</p>

        <button type="submit" :disabled="sending"
          class="w-full bg-whatsapp text-white font-extrabold text-base py-3.5 rounded-xl cursor-pointer mt-2.5 shadow-lg disabled:opacity-70">
          {{ sending ? 'Enviando…' : 'Enviar pedido no WhatsApp' }}
        </button>
      </form>

      <div v-else class="text-center py-3" role="status">
        <div class="text-5xl text-whatsapp mb-2.5" aria-hidden="true">✓</div>
        <h2 id="checkout-title" class="text-lg font-extrabold text-primary-dark mb-2">Pedido enviado!</h2>
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
import { validateCheckout } from '../domain/order'

const props = defineProps<{ isOpen: boolean; isSubmitted: boolean; sending?: boolean; orderCode?: string }>()
const emit = defineEmits(['close', 'send', 'reset'])

const orderType = ref<OrderType>('mesa')
const tableNum = ref('')
const address = ref('')
const error = ref('')
const dialogEl = ref<HTMLElement | null>(null)

/* Leva o foco para o diálogo ao abrir */
watch(() => props.isOpen, async (open) => {
  if (!open) return
  error.value = ''
  await nextTick()
  dialogEl.value?.focus()
})

/* Valida e envia */
const handleSubmit = () => {
  error.value = validateCheckout(orderType.value, String(tableNum.value), address.value)
  if (error.value) return
  emit('send', orderType.value, String(tableNum.value), address.value)
}
</script>
<!-- Fim de CheckoutModal.vue -->
