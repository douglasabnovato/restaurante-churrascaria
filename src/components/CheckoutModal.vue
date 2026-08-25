<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/60 flex justify-center items-end z-40 backdrop-blur-xs">
    <div class="bg-surface w-full max-w-[480px] rounded-t-2xl p-6 animate-slide-up">
      
      <!-- Estado 1: Form de Checkout -->
      <div v-if="!isSubmitted">
        <div class="flex justify-between items-center mb-5 pb-2.5 border-b border-slate-200">
          <h3 class="text-base font-extrabold text-primary-dark">Finalizar Pedido</h3>
          <button @click="$emit('close')" class="text-xl font-bold text-slate-500 hover:text-dark">✕</button>
        </div>

        <div class="mb-3.5">
          <label class="block text-xs font-bold text-dark mb-1.5">Tipo de Pedido:</label>
          <select v-model="orderType" class="w-full p-3 border border-slate-200 rounded-lg text-sm bg-body">
            <option value="mesa">Consumo no Local (Mesa)</option>
            <option value="delivery">Delivery (Entrega em Casa)</option>
          </select>
        </div>

        <div v-if="orderType === 'mesa'" class="mb-3.5">
          <label class="block text-xs font-bold text-dark mb-1.5">Número da Mesa / Identificação:</label>
          <input 
            v-model="tableNum" 
            type="number" 
            placeholder="Ex: 04" 
            class="w-full p-3 border border-slate-200 rounded-lg text-sm bg-body"
          />
        </div>

        <div v-else class="mb-3.5">
          <label class="block text-xs font-bold text-dark mb-1.5">Endereço Completo de Entrega:</label>
          <input 
            v-model="address" 
            type="text" 
            placeholder="Rua, número, bairro e referência" 
            class="w-full p-3 border border-slate-200 rounded-lg text-sm bg-body"
          />
        </div>

        <button 
          @click="handleSubmit" 
          class="w-full bg-whatsapp text-white font-extrabold text-base py-3.5 rounded-xl cursor-pointer mt-2.5 shadow-lg shadow-whatsapp/30"
        >
          Enviar Pedido no WhatsApp
        </button>
      </div>

      <!-- Estado 2: Confirmação de Sucesso Pós-Envio -->
      <div v-else class="text-center py-3">
        <div class="text-5xl text-whatsapp mb-2.5">✓</div>
        <h3 class="text-lg font-extrabold text-primary-dark mb-2">Pedido realizado com sucesso!</h3>
        <p class="text-xs text-slate-500 mb-6 leading-relaxed">
          Seu pedido foi direcionado para o nosso WhatsApp.
        </p>
        <button 
          @click="$emit('reset')" 
          class="w-full bg-primary text-white font-extrabold text-sm py-3 px-5 rounded-lg cursor-pointer"
        >
          Voltar ao cardápio
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { OrderType } from '../types'

defineProps<{
  isOpen: boolean;
  isSubmitted: boolean;
}>()

const emit = defineEmits(['close', 'send', 'reset'])

const orderType = ref<OrderType>('mesa')
const tableNum = ref('')
const address = ref('')

const handleSubmit = () => {
  emit('send', orderType.value, tableNum.value, address.value)
}
</script>